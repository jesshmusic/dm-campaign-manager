require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::AccountsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user, name: 'Dorman Lakely', username: 'dorman') }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }

  describe 'GET /v1/foundry/me' do
    it 'returns the account for a valid token' do
      get '/v1/foundry/me', headers: { 'Authorization' => "Bearer #{token.plaintext_token}" }

      expect(response).to have_http_status(:success)
      expect(json['user']).to eq('name' => 'Dorman Lakely', 'username' => 'dorman')
      expect(json['premium']).to be false
      expect(json['patreon']).to be_nil
    end

    it 'reports premium access from a linked Patreon account' do
      create(:patreon_user, :wizard, user_id: nil, linked_user: user)

      get '/v1/foundry/me', headers: { 'Authorization' => "Bearer #{token.plaintext_token}" }

      expect(json['premium']).to be true
      expect(json['patreon']['tierName']).to eq('Wizard')
    end

    it 'records when the token was used' do
      travel_to Time.zone.local(2026, 10, 15, 12, 0, 0) do
        get '/v1/foundry/me', headers: { 'Authorization' => "Bearer #{token.plaintext_token}" }
      end

      expect(token.reload.last_used_at).to eq(Time.zone.local(2026, 10, 15, 12, 0, 0))
    end

    it 'rejects a missing token' do
      get '/v1/foundry/me'

      expect(response).to have_http_status(:unauthorized)
    end

    it 'rejects an unknown token' do
      get '/v1/foundry/me', headers: { 'Authorization' => "Bearer #{ApiToken::PREFIX}not-a-real-token" }

      expect(response).to have_http_status(:unauthorized)
    end

    it 'rejects a revoked token' do
      plaintext = token.plaintext_token
      token.destroy

      get '/v1/foundry/me', headers: { 'Authorization' => "Bearer #{plaintext}" }

      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not accept an Auth0 session token' do
      stub_authentication(user)

      get '/v1/foundry/me', headers: { 'Authorization' => 'Bearer some.jwt.token' }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
