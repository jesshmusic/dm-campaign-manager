require 'rails_helper'

RSpec.describe 'Admin::V1::OpenAIKeysController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:key) { "sk-proj-#{'Ab3_cD9-' * 4}9xYz" }
  let(:old_key) { "sk-old#{'q' * 30}0ldK" }
  let(:path) { '/v1/openai-key' }
  let(:verifier) { instance_double(OpenAIClient, verify_key!: nil) }

  def saved_key
    User.find(user.id).openai_api_key
  end

  before do
    allow(OpenAIClient).to receive(:new).and_return(verifier)
  end

  describe 'GET /v1/openai-key' do
    before { stub_authentication(user) }

    it 'reports that no key is saved' do
      get path

      expect(response).to have_http_status(:ok)
      expect(json).to eq('configured' => false, 'hint' => nil, 'hostedAvailable' => false)
    end

    it 'identifies a saved key by its last four characters only' do
      user.update!(openai_api_key: key)

      get path

      expect(json).to eq('configured' => true, 'hint' => 'sk-…9xYz', 'hostedAvailable' => false)
      expect(response.body).not_to include(key)
    end

    it 'shows that hosted AI is available to premium members' do
      create(:patreon_user, :wizard, user_id: nil, linked_user: user)

      get path

      expect(json).to eq('configured' => false, 'hint' => nil, 'hostedAvailable' => true)
    end
  end

  describe 'PUT /v1/openai-key' do
    before { stub_authentication(user) }

    it 'checks the key with OpenAI, then saves it' do
      put path, params: { openai_key: { api_key: "  #{key}\n" } }, as: :json

      expect(response).to have_http_status(:ok)
      expect(OpenAIClient).to have_received(:new).with(api_key: key)
      expect(verifier).to have_received(:verify_key!)
      expect(saved_key).to eq(key)
      expect(json).to eq('configured' => true, 'hint' => 'sk-…9xYz', 'hostedAvailable' => false)
      expect(response.body).not_to include(key)
    end

    it 'replaces a saved key' do
      user.update!(openai_api_key: old_key)

      put path, params: { openai_key: { api_key: key } }, as: :json

      expect(response).to have_http_status(:ok)
      expect(saved_key).to eq(key)
      expect(response.body).not_to include(old_key)
    end

    it 'rejects a value that is not an OpenAI key without calling OpenAI' do
      put path, params: { openai_key: { api_key: 'hunter2' } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['OpenAI api key must be an OpenAI API key (sk-…)'])
      expect(OpenAIClient).not_to have_received(:new)
      expect(saved_key).to be_nil
      expect(response.body).not_to include('hunter2')
    end

    it 'rejects a blank key and keeps the saved one' do
      user.update!(openai_api_key: old_key)

      put path, params: { openai_key: { api_key: '   ' } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(OpenAIClient).not_to have_received(:new)
      expect(saved_key).to eq(old_key)
    end

    context 'when OpenAI rejects the key' do
      before do
        allow(verifier).to receive(:verify_key!)
          .and_raise(OpenAIClient::Error, "Incorrect API key provided: #{key.first(10)}****9xYz")
      end

      it 'responds 422 and keeps the saved key' do
        user.update!(openai_api_key: old_key)

        put path, params: { openai_key: { api_key: key } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to eq('errors' => ['OpenAI did not accept that key. Check it and try again.'])
        expect(saved_key).to eq(old_key)
        expect(response.body).not_to include(key)
        expect(response.body).not_to include(old_key)
        expect(response.body).not_to include('Incorrect API key')
      end
    end

    it 'ignores attributes other than the key' do
      put path, params: { openai_key: { api_key: key, role: 'admin' }, role: 'admin' }, as: :json

      expect(response).to have_http_status(:ok)
      expect(user.reload).not_to be_admin
    end
  end

  describe 'DELETE /v1/openai-key' do
    before { stub_authentication(user) }

    it 'removes the saved key' do
      user.update!(openai_api_key: key)

      delete path

      expect(response).to have_http_status(:no_content)
      expect(response.body).to be_empty
      expect(saved_key).to be_nil
    end

    it 'succeeds when no key is saved' do
      delete path

      expect(response).to have_http_status(:no_content)
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'returns 401 and changes nothing' do
      user.update!(openai_api_key: old_key)

      get path
      expect(response).to have_http_status(:unauthorized)

      put path, params: { openai_key: { api_key: key } }, as: :json
      expect(response).to have_http_status(:unauthorized)

      delete path
      expect(response).to have_http_status(:unauthorized)

      expect(OpenAIClient).not_to have_received(:new)
      expect(saved_key).to eq(old_key)
    end
  end
end
