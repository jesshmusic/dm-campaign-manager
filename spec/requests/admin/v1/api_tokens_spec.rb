require 'rails_helper'

RSpec.describe 'Admin::V1::ApiTokensController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }

  describe 'GET /v1/api-tokens' do
    before { stub_authentication(user) }

    it "lists only the current user's tokens without secrets" do
      mine = ApiToken.issue!(user: user, name: 'Foundry')
      ApiToken.issue!(user: create(:dungeon_master_user), name: 'Not mine')

      get '/v1/api-tokens'

      expect(response).to have_http_status(:success)
      expect(json.length).to eq(1)
      expect(json.first).to include('id' => mine.id.to_s, 'name' => 'Foundry', 'tokenPrefix' => mine.token_prefix)
      expect(json.first).not_to have_key('token')
      expect(response.body).not_to include(mine.token_digest)
    end
  end

  describe 'POST /v1/api-tokens' do
    before { stub_authentication(user) }

    it 'creates a token and returns the plaintext once' do
      expect do
        post '/v1/api-tokens', params: { api_token: { name: 'My Foundry world' } }
      end.to change(user.api_tokens, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json['name']).to eq('My Foundry world')
      expect(json['token']).to start_with(ApiToken::PREFIX)
      expect(ApiToken.authenticate(json['token'])).to eq(user.api_tokens.last)
    end

    it 'requires a name' do
      post '/v1/api-tokens', params: { api_token: { name: '' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include("Name can't be blank")
    end

    it 'enforces the per-user limit' do
      ApiToken::MAX_PER_USER.times { |i| ApiToken.issue!(user: user, name: "Token #{i}") }

      post '/v1/api-tokens', params: { api_token: { name: 'One too many' } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE /v1/api-tokens/:id' do
    before { stub_authentication(user) }

    it 'revokes the token' do
      token = ApiToken.issue!(user: user, name: 'Foundry')

      delete "/v1/api-tokens/#{token.id}"

      expect(response).to have_http_status(:no_content)
      expect(ApiToken.exists?(token.id)).to be false
    end

    it "cannot revoke another user's token" do
      other_token = ApiToken.issue!(user: create(:dungeon_master_user), name: 'Not mine')

      delete "/v1/api-tokens/#{other_token.id}"

      expect(response).to have_http_status(:not_found)
      expect(ApiToken.exists?(other_token.id)).to be true
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'returns 401' do
      get '/v1/api-tokens'
      expect(response).to have_http_status(:unauthorized)

      post '/v1/api-tokens', params: { api_token: { name: 'Sneaky' } }
      expect(response).to have_http_status(:unauthorized)
      expect(ApiToken.count).to eq(0)
    end
  end
end
