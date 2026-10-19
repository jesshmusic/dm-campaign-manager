require 'rails_helper'

RSpec.describe 'Admin::V1::DeviceLinksController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let!(:link) { DeviceLink.start!(world_id: 'abc123', world_title: 'Dev') }
  let(:code) { link.display_user_code }

  describe 'GET /v1/device-links/:user_code' do
    before { stub_authentication(user) }

    it 'shows a pending code with the world asking' do
      get "/v1/device-links/#{code}"

      expect(response).to have_http_status(:success)
      expect(json).to eq('userCode' => code, 'worldTitle' => 'Dev', 'expiresAt' => link.expires_at.iso8601)
    end

    it 'accepts the code without the dash, in any case' do
      get "/v1/device-links/#{link.user_code.downcase}"

      expect(response).to have_http_status(:success)
      expect(json['userCode']).to eq(code)
    end

    it 'returns 404 for an unknown code' do
      get '/v1/device-links/ABCD-EFGH'

      expect(response).to have_http_status(:not_found)
      expect(json['errors']).to be_present
    end

    it 'returns 404 for an expired code' do
      link.update!(expires_at: 1.second.ago)

      get "/v1/device-links/#{code}"

      expect(response).to have_http_status(:not_found)
    end

    it 'returns 404 for a code that was already approved or denied' do
      link.approve!(create(:dungeon_master_user))
      get "/v1/device-links/#{code}"
      expect(response).to have_http_status(:not_found)

      other = DeviceLink.start!
      other.deny!
      get "/v1/device-links/#{other.display_user_code}"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /v1/device-links/:user_code/approve' do
    before { stub_authentication(user) }

    it 'binds the code to the signed-in user' do
      post "/v1/device-links/#{code}/approve"

      expect(response).to have_http_status(:no_content)
      expect(link.reload.user).to eq(user)
      expect(link.approved_at).to be_present
      # The token is issued when Foundry next polls, not now
      expect(user.api_tokens.count).to eq(0)
    end

    it 'lets Foundry pick up a token for the user' do
      post "/v1/device-links/#{code}/approve"

      status, token = link.reload.poll!

      expect(status).to eq(:approved)
      expect(token.user).to eq(user)
    end

    it 'cannot approve a code twice' do
      post "/v1/device-links/#{code}/approve"
      post "/v1/device-links/#{code}/approve"

      expect(response).to have_http_status(:not_found)
    end

    it 'refuses when the user already has the most API tokens allowed' do
      ApiToken::MAX_PER_USER.times { |i| ApiToken.issue!(user: user, name: "Token #{i}") }

      post "/v1/device-links/#{code}/approve"

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors'].first).to include("at most #{ApiToken::MAX_PER_USER} API tokens")
      expect(link.reload.approved_at).to be_nil
    end

    it 'returns 404 for an expired code' do
      link.update!(expires_at: 1.second.ago)

      post "/v1/device-links/#{code}/approve"

      expect(response).to have_http_status(:not_found)
      expect(link.reload.user).to be_nil
    end
  end

  describe 'POST /v1/device-links/:user_code/deny' do
    before { stub_authentication(user) }

    it 'denies the code' do
      post "/v1/device-links/#{code}/deny"

      expect(response).to have_http_status(:no_content)
      expect(link.reload.denied_at).to be_present
      expect(link.poll!).to eq([:denied])
    end

    it 'returns 404 for an unknown code' do
      post '/v1/device-links/ABCD-EFGH/deny'

      expect(response).to have_http_status(:not_found)
    end
  end

  context 'when not signed in' do
    before { stub_no_auth }

    it 'returns 401 and leaves the code pending' do
      get "/v1/device-links/#{code}"
      expect(response).to have_http_status(:unauthorized)

      post "/v1/device-links/#{code}/approve"
      expect(response).to have_http_status(:unauthorized)

      post "/v1/device-links/#{code}/deny"
      expect(response).to have_http_status(:unauthorized)

      expect(link.reload).to be_pending
    end
  end
end
