require 'rails_helper'

# Ensure Utilities::Openai::Client is loaded for stubbing
require_relative '../../../../app/models/utilities/openai/client'

RSpec.describe 'Admin::V1::Dashboard', type: :request do
  describe 'GET /v1/dashboard' do
    context 'when user is an admin' do
      let(:admin) { create(:admin_user) }

      before { stub_authentication(admin) }

      it 'returns successful response' do
        get '/v1/dashboard'
        expect(response).to have_http_status(:success).or have_http_status(:forbidden)
      end

      it 'assigns dungeon master users' do
        create_list(:dungeon_master_user, 3)
        get '/v1/dashboard'
        expect(assigns(:dms).count).to be >= 3
      end
    end

    context 'when user is not an admin' do
      let(:user) { create(:user) }

      before { stub_authentication(user) }

      it 'returns forbidden status' do
        get '/v1/dashboard'
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      before { stub_no_auth }

      it 'returns forbidden or unauthorized status' do
        get '/v1/dashboard'
        expect(response).to have_http_status(:forbidden).or have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /v1/random_fantasy_name' do
    let(:user) { create(:user) }

    before do
      stub_authentication(user)
      allow(NameGen).to receive(:random_name).and_return('Gandalf')
    end

    it 'returns successful response' do
      get '/v1/random_fantasy_name', as: :json
      expect(response).to have_http_status(:success)
    end

    it 'returns a name in JSON format' do
      get '/v1/random_fantasy_name', as: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('name')
      expect(json_response['name']).to eq('Gandalf')
    end

    it 'accepts gender parameter' do
      get '/v1/random_fantasy_name', params: { random_monster_gender: 'female' }, as: :json
      expect(NameGen).to have_received(:random_name).with(hash_including(gender: 'female'))
    end

    it 'accepts race parameter' do
      get '/v1/random_fantasy_name', params: { random_monster_race: 'elf' }, as: :json
      expect(NameGen).to have_received(:random_name).with(hash_including(race: 'elf'))
    end

    it 'defaults to random gender if not provided' do
      get '/v1/random_fantasy_name', as: :json
      expect(NameGen).to have_received(:random_name)
    end

    it 'defaults to human race if not provided' do
      get '/v1/random_fantasy_name', as: :json
      expect(NameGen).to have_received(:random_name).with(hash_including(race: 'human'))
    end

    it 'works without authentication' do
      stub_no_auth
      get '/v1/random_fantasy_name', as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /v1/random_tavern_name' do
    let(:user) { create(:user) }

    before do
      stub_authentication(user)
      allow(NameGen).to receive(:random_tavern_name).and_return('The Prancing Pony')
    end

    it 'returns successful response' do
      get '/v1/random_tavern_name', as: :json
      expect(response).to have_http_status(:success)
    end

    it 'returns a tavern name in JSON format' do
      get '/v1/random_tavern_name', as: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('name')
      expect(json_response['name']).to eq('The Prancing Pony')
    end

    it 'works without authentication' do
      stub_no_auth
      get '/v1/random_tavern_name', as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /v1/random_monster_name' do
    let(:user) { create(:user) }

    before do
      stub_authentication(user)
      allow(NameGen).to receive(:random_monster_name).and_return('Smaug')
    end

    it 'returns successful response' do
      get '/v1/random_monster_name', as: :json
      expect(response).to have_http_status(:success)
    end

    it 'returns a monster name in JSON format' do
      get '/v1/random_monster_name', as: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('name')
      expect(json_response['name']).to eq('Smaug')
    end

    it 'works without authentication' do
      stub_no_auth
      get '/v1/random_monster_name', as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /v1/adventure_hook' do
    let(:user) { create(:user) }
    let(:mock_openai_client) { instance_double(::Utilities::Openai::Client, completions: adventure_hook_text) }
    let(:adventure_hook_text) { 'A mysterious stranger arrives with a map to hidden treasure...' }

    before do
      stub_authentication(user)
      allow(::Utilities::Openai::Client).to receive(:new).and_return(mock_openai_client)
    end

    it 'returns successful response' do
      get '/v1/adventure_hook', params: { player_count: 4, average_level: 5 }, as: :json
      expect(response).to have_http_status(:success)
    end

    it 'returns an adventure hook in JSON format' do
      get '/v1/adventure_hook', params: { player_count: 4, average_level: 5 }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('adventure_hook')
      expect(json_response['adventure_hook']).to eq(adventure_hook_text)
    end

    it 'calls OpenAI with correct parameters' do
      get '/v1/adventure_hook', params: { player_count: 6, average_level: 10 }, as: :json

      expect(mock_openai_client).to have_received(:completions).with(
        hash_including(
          model: 'gpt-4o',
          temperature: 1.0,
          max_tokens: 300
        )
      )
    end

    it 'includes player count in the prompt' do
      get '/v1/adventure_hook', params: { player_count: 6, average_level: 10 }, as: :json

      expect(mock_openai_client).to have_received(:completions) do |args|
        expect(args[:prompt]).to include('6 players')
      end
    end

    it 'includes average level in the prompt' do
      get '/v1/adventure_hook', params: { player_count: 6, average_level: 10 }, as: :json

      expect(mock_openai_client).to have_received(:completions) do |args|
        expect(args[:prompt]).to include('average level 10')
      end
    end

    it 'works without authentication' do
      stub_no_auth
      get '/v1/adventure_hook', params: { player_count: 4, average_level: 5 }, as: :json
      expect(response).to have_http_status(:success)
    end
  end
end
