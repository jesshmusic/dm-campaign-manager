# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OpenAIClient do
  # A Net::HTTP response with its body already read, as Net::HTTP.start returns it
  def http_response(klass, code, body, message = 'OK')
    klass.new('1.1', code, message).tap do |response|
      response.instance_variable_set(:@body, body)
      response.instance_variable_set(:@read, true)
    end
  end

  before do
    # Never reach the real OpenAI API from specs
    allow(Net::HTTP).to receive(:start).and_raise('Real HTTP request attempted in a spec')
  end

  describe '.for' do
    let(:own_key) { "sk-own#{'a' * 24}" }
    let(:hosted_key) { "sk-hosted#{'b' * 24}" }
    let(:user) { create(:dungeon_master_user) }

    before do
      allow(ENV).to receive(:fetch).and_call_original
      allow(ENV).to receive(:fetch).with('OPENAI_API_KEY', nil).and_return(hosted_key)
    end

    def key_of(client)
      client.send(:headers).fetch('Authorization').delete_prefix('Bearer ')
    end

    def make_premium(user)
      create(:patreon_user, :wizard, user_id: nil, linked_user: user)
      user.reload
    end

    it "uses the user's own key" do
      user.update!(openai_api_key: own_key)

      expect(key_of(described_class.for(user))).to eq(own_key)
    end

    it "prefers the user's own key to the hosted key for premium members" do
      user.update!(openai_api_key: own_key)
      make_premium(user)

      expect(key_of(described_class.for(user))).to eq(own_key)
    end

    it 'falls back to the hosted key for Patreon premium members' do
      make_premium(user)

      expect(key_of(described_class.for(user))).to eq(hosted_key)
    end

    it 'falls back to the hosted key for admins' do
      expect(key_of(described_class.for(create(:admin_user)))).to eq(hosted_key)
    end

    it 'raises NoKeyError for a user with neither a key nor premium' do
      expect { described_class.for(user) }.to raise_error(
        described_class::NoKeyError, 'Add your OpenAI API key in your dashboard, or join Patreon for hosted AI.'
      )
    end

    it 'raises NoKeyError for a free Patreon member' do
      create(:patreon_user, :free, user_id: nil, linked_user: user)

      expect { described_class.for(user.reload) }.to raise_error(described_class::NoKeyError)
    end

    it 'raises NoKeyError once a premium Patreon login expires' do
      create(:patreon_user, :wizard, :expired, user_id: nil, linked_user: user)

      expect { described_class.for(user.reload) }.to raise_error(described_class::NoKeyError)
    end

    it 'raises NoKeyError for a premium member when no hosted key is configured' do
      allow(ENV).to receive(:fetch).with('OPENAI_API_KEY', nil).and_return(nil)
      make_premium(user)

      expect { described_class.for(user) }.to raise_error(described_class::NoKeyError)
    end

    it 'raises NoKeyError without a user' do
      expect { described_class.for(nil) }.to raise_error(described_class::NoKeyError)
    end

    it 'makes NoKeyError a kind of OpenAIClient::Error' do
      expect(described_class::NoKeyError.new).to be_a(described_class::Error)
    end
  end

  describe 'requests' do
    let(:client) { described_class.new(api_key: 'sk-test-key', default_model: 'gpt-test') }
    let(:requests) { [] }
    let(:response) do
      http_response(Net::HTTPOK, '200', {
        choices: [{ message: { content: "  Hello there  \n" } }],
        usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 }
      }.to_json)
    end

    before do
      allow(client).to receive(:http_request) do |method, path, body: nil|
        requests << { method: method, path: path, body: body && JSON.parse(body) }
        response
      end
    end

    describe '#completions' do
      it 'sends the system message before the prompt' do
        client.completions(prompt: 'Plan a heist', system: 'You are a DM')

        expect(requests.sole).to include(method: :Post, path: '/v1/chat/completions')
        expect(requests.sole[:body]['messages']).to eq(
          [{ 'role' => 'system', 'content' => 'You are a DM' }, { 'role' => 'user', 'content' => 'Plan a heist' }]
        )
      end

      it 'sends only the prompt without a system message' do
        client.completions(prompt: 'Plan a heist')

        expect(requests.sole[:body]['messages']).to eq([{ 'role' => 'user', 'content' => 'Plan a heist' }])
      end

      it 'uses the defaults merged with the given options' do
        client.completions(prompt: 'Hi', max_tokens: 500, temperature: 0.2)

        expect(requests.sole[:body]).to include('model' => 'gpt-test', 'max_tokens' => 500, 'temperature' => 0.2, 'n' => 1)
        expect(requests.sole[:body]).not_to have_key('response_format')
      end

      it 'asks for a JSON object in JSON mode' do
        client.completions(prompt: 'Hi', json_mode: true, model: 'gpt-json')

        expect(requests.sole[:body]).to include('model' => 'gpt-json', 'response_format' => { 'type' => 'json_object' })
      end

      it 'sends a JSON schema for structured outputs, in place of JSON mode' do
        schema = { name: 'plan', strict: true, schema: { type: 'object', properties: {}, required: [], additionalProperties: false } }

        client.completions(prompt: 'Hi', json_mode: true, json_schema: schema)

        expect(requests.sole[:body]['response_format']).to eq(
          'type' => 'json_schema',
          'json_schema' => { 'name' => 'plan', 'strict' => true,
                             'schema' => { 'type' => 'object', 'properties' => {}, 'required' => [],
                                           'additionalProperties' => false } }
        )
      end

      it 'returns the trimmed content' do
        expect(client.completions(prompt: 'Hi')).to eq('Hello there')
      end

      it 'returns the usage when asked' do
        expect(client.completions(prompt: 'Hi', return_usage: true)).to eq(
          content: 'Hello there', usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 }
        )
      end

      it 'sends the API key as a bearer token' do
        expect(client.send(:headers)).to include('Authorization' => 'Bearer sk-test-key',
                                                 'Content-Type' => 'application/json')
      end

      context 'when OpenAI returns an error' do
        let(:response) do
          http_response(Net::HTTPTooManyRequests, '429', { error: { message: 'Rate limit reached' } }.to_json,
                        'Too Many Requests')
        end

        it "raises an Error with OpenAI's message" do
          expect { client.completions(prompt: 'Hi') }.to raise_error(described_class::Error, 'Rate limit reached')
          expect(client.last_response.status_code).to eq(429)
        end
      end
    end

    describe '#verify_key!' do
      let(:response) { http_response(Net::HTTPOK, '200', { object: 'list', data: [] }.to_json) }

      it 'lists models and returns nil when OpenAI accepts the key' do
        expect(client.verify_key!).to be_nil
        expect(requests.sole).to eq(method: :Get, path: '/v1/models', body: nil)
      end

      context 'when OpenAI rejects the key' do
        let(:response) do
          http_response(Net::HTTPUnauthorized, '401',
                        { error: { message: 'Incorrect API key provided', code: 'invalid_api_key' } }.to_json,
                        'Unauthorized')
        end

        it 'raises an Error' do
          expect { client.verify_key! }.to raise_error(described_class::Error, 'Incorrect API key provided')
          expect(client.last_response.status_code).to eq(401)
        end
      end
    end
  end
end
