require 'rails_helper'

RSpec.describe 'Admin::V1::PatreonAuthController', type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /v1/users/:user_id/ready' do
    context 'when user exists and is authenticated' do
      let(:user) { create(:patreon_user, :wizard, expires_at: 1.week.from_now) }

      it 'returns user data' do
        get "/v1/users/#{user.user_id}/ready"

        expect(response).to have_http_status(:success)
        expect(json['userId']).to eq(user.user_id)
        expect(json['has_premium']).to be true
        expect(json['tier_name']).to eq('Wizard')
      end

      it 'includes expiry information' do
        get "/v1/users/#{user.user_id}/ready"

        expect(json['expires_in']).to be_a(Integer)
        expect(json['expires_in']).to be > 0
      end
    end

    context 'when user exists but is expired' do
      let(:expired_user) { create(:patreon_user, :expired) }

      it 'returns 404' do
        get "/v1/users/#{expired_user.user_id}/ready"

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user does not exist' do
      it 'returns 404' do
        get '/v1/users/non_existent_user/ready'

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user exists but is not authenticated' do
      let(:unauthenticated_user) { create(:patreon_user, :unauthenticated) }

      it 'returns 404' do
        get "/v1/users/#{unauthenticated_user.user_id}/ready"

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'GET /v1/patreon/callback' do
    let(:user_id) { 'foundry_user_123' }
    let(:code) { 'patreon_auth_code_abc' }
    let(:token_response) do
      {
        'access_token' => 'access_token_123',
        'refresh_token' => 'refresh_token_456',
        'expires_in' => 2592000
      }
    end

    let(:patreon_data) do
      {
        'data' => {
          'id' => 'patreon_123',
          'attributes' => {
            'email' => 'user@example.com',
            'full_name' => 'Test User'
          }
        },
        'included' => [
          {
            'type' => 'member',
            'attributes' => {
              'currently_entitled_amount_cents' => 500
            }
          },
          {
            'type' => 'tier',
            'attributes' => {
              'title' => 'Wizard'
            }
          }
        ]
      }
    end

    before do
      allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:exchange_code_for_token).and_return(token_response)
      allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:fetch_patreon_membership).and_return(patreon_data)
    end

    context 'with valid code and state' do
      it 'creates a new patreon user' do
        expect {
          get '/v1/patreon/callback', params: { code: code, state: user_id }
        }.to change(PatreonUser, :count).by(1)

        expect(response).to have_http_status(:success)
      end

      it 'stores patreon data correctly' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        user = PatreonUser.find_by(user_id: user_id)
        expect(user.patreon_id).to eq('patreon_123')
        expect(user.email).to eq('user@example.com')
        expect(user.name).to eq('Test User')
        expect(user.access_token).to eq('access_token_123')
        expect(user.refresh_token).to eq('refresh_token_456')
      end

      it 'determines tier correctly for premium users' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        user = PatreonUser.find_by(user_id: user_id)
        expect(user.has_premium).to be true
        expect(user.tier_name).to eq('Wizard')
      end

      it 'determines tier correctly for free users' do
        free_data = patreon_data.deep_dup
        free_data['included'][0]['attributes']['currently_entitled_amount_cents'] = 0
        free_data['included'][1]['attributes']['title'] = 'Free'
        allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:fetch_patreon_membership).and_return(free_data)

        get '/v1/patreon/callback', params: { code: code, state: user_id }

        user = PatreonUser.find_by(user_id: user_id)
        expect(user.has_premium).to be false
        expect(user.tier_name).to eq('Free')
      end

      it 'maps legacy Adventurer tier to Wizard' do
        legacy_data = patreon_data.deep_dup
        legacy_data['included'][1]['attributes']['title'] = 'Adventurer'
        allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:fetch_patreon_membership).and_return(legacy_data)

        get '/v1/patreon/callback', params: { code: code, state: user_id }

        user = PatreonUser.find_by(user_id: user_id)
        expect(user.tier_name).to eq('Wizard')
      end

      it 'updates existing user instead of creating duplicate' do
        existing_user = create(:patreon_user, user_id: user_id)

        expect {
          get '/v1/patreon/callback', params: { code: code, state: user_id }
        }.not_to change(PatreonUser, :count)

        existing_user.reload
        expect(existing_user.patreon_id).to eq('patreon_123')
        expect(existing_user.has_premium).to be true
      end

      it 'sets expiry date 30 days in the future' do
        travel_to Time.current do
          get '/v1/patreon/callback', params: { code: code, state: user_id }

          user = PatreonUser.find_by(user_id: user_id)
          expect(user.expires_at).to be_within(1.second).of(30.days.from_now)
        end
      end

      it 'returns HTML success page' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        expect(response.body).to include('Authentication Successful')
        expect(response.body).to include('Wizard')
      end
    end

    context 'without code parameter' do
      it 'returns error' do
        get '/v1/patreon/callback', params: { state: user_id }

        expect(response).to have_http_status(:bad_request)
        expect(response.body).to include('Missing authorization code or state')
      end
    end

    context 'without state parameter' do
      it 'returns error' do
        get '/v1/patreon/callback', params: { code: code }

        expect(response).to have_http_status(:bad_request)
        expect(response.body).to include('Missing authorization code or state')
      end
    end

    context 'when token exchange fails' do
      before do
        allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:exchange_code_for_token).and_raise('Token exchange failed')
      end

      it 'returns error page' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        expect(response).to have_http_status(:internal_server_error)
        expect(response.body).to include('Authentication Failed')
      end
    end

    context 'when membership fetch fails' do
      before do
        allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:fetch_patreon_membership).and_raise('API Error')
      end

      it 'returns error page' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        expect(response).to have_http_status(:internal_server_error)
        expect(response.body).to include('Authentication Failed')
      end
    end

    context 'with missing tier information' do
      let(:minimal_patreon_data) do
        {
          'data' => {
            'id' => 'patreon_123',
            'attributes' => {
              'email' => 'user@example.com',
              'full_name' => 'Test User'
            }
          },
          'included' => []
        }
      end

      before do
        allow_any_instance_of(Admin::V1::PatreonAuthController).to receive(:fetch_patreon_membership).and_return(minimal_patreon_data)
      end

      it 'defaults to free tier' do
        get '/v1/patreon/callback', params: { code: code, state: user_id }

        user = PatreonUser.find_by(user_id: user_id)
        expect(user.tier_name).to eq('Free')
        expect(user.has_premium).to be false
      end
    end
  end
end
