require 'rails_helper'

# Foundry premium checks renew a lapsed Patreon membership before deciding
RSpec.describe 'Patreon refresh on Foundry requests', type: :request do
  include PatreonHttpStubs

  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }
  let(:expires_at) { 3.days.ago }
  let!(:account) do
    create(:patreon_user, :wizard, user_id: nil, linked_user: user, expires_at: expires_at, refresh_token: 'old_refresh')
  end

  before { allow(Rails).to receive(:cache).and_return(ActiveSupport::Cache::MemoryStore.new) }

  context 'when the lapsed patron is still paying' do
    before { stub_patreon_http(token: [200, patreon_token_body], identity: [200, patreon_identity_body(cents: 500)]) }

    it 'renews the membership and lets a premium request through' do
      get '/v1/foundry/compendium', headers: headers

      expect(response).to have_http_status(:success)
      account.reload
      expect(account.premium_active?).to be true
      expect(account.refresh_token).to eq('new_refresh_token')
    end

    it 'reports premium again from /v1/foundry/me' do
      get '/v1/foundry/me', headers: headers

      expect(json['premium']).to be true
      expect(json['patreon']).to include('active' => true, 'hasPremium' => true, 'tierName' => 'Wizard')
    end
  end

  context 'when the token expires within a day' do
    let(:expires_at) { 6.hours.from_now }

    before { stub_patreon_http(token: [200, patreon_token_body], identity: [200, patreon_identity_body]) }

    it 'renews it ahead of time' do
      get '/v1/foundry/compendium', headers: headers

      expect(response).to have_http_status(:success)
      expect(account.reload.expires_at).to be > 30.days.from_now
    end
  end

  context 'when the patron has revoked access' do
    before { stub_patreon_http(token: [400, { 'error' => 'invalid_grant' }]) }

    it 'refuses the premium request and keeps the link for re-linking' do
      get '/v1/foundry/compendium', headers: headers

      expect(response).to have_http_status(:forbidden)
      expect(json['code']).to eq('premium_required')
      expect(account.reload).to have_attributes(has_premium: false, refresh_token: nil, linked_user: user)
    end
  end

  context 'when Patreon is down' do
    before { stub_patreon_http(token: [503, 'Service Unavailable']) }

    it 'refuses the request without dropping the account' do
      get '/v1/foundry/compendium', headers: headers

      expect(response).to have_http_status(:forbidden)
      expect(account.reload).to have_attributes(has_premium: true, refresh_token: 'old_refresh')
    end

    it 'asks Patreon at most once an hour per account' do
      2.times { get '/v1/foundry/compendium', headers: headers }
      get '/v1/foundry/me', headers: headers

      expect(Net::HTTP).to have_received(:start).once

      travel(PatreonMembership::LAZY_REFRESH_INTERVAL + 1.minute) { get '/v1/foundry/compendium', headers: headers }

      expect(Net::HTTP).to have_received(:start).twice
    end
  end

  context 'when the membership is current' do
    let(:expires_at) { 10.days.from_now }

    it 'does not call Patreon' do
      allow(Net::HTTP).to receive(:start)

      get '/v1/foundry/compendium', headers: headers
      get '/v1/foundry/me', headers: headers

      expect(response).to have_http_status(:success)
      expect(Net::HTTP).not_to have_received(:start)
    end
  end
end
