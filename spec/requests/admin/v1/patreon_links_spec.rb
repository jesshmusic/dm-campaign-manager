require 'rails_helper'

RSpec.describe 'Admin::V1::PatreonLinksController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }

  describe 'GET /v1/patreon/link' do
    context 'when the user has not linked Patreon' do
      before { stub_authentication(user) }

      it 'reports an unlinked, non-premium account' do
        get '/v1/patreon/link'

        expect(response).to have_http_status(:success)
        expect(json).to eq('linked' => false, 'premium' => false, 'account' => nil)
      end
    end

    context 'when the user has linked a premium Patreon account' do
      before do
        create(:patreon_user, :wizard, user_id: nil, linked_user: user, name: 'Pat Ron')
        stub_authentication(user)
      end

      it 'reports the linked account and premium access' do
        get '/v1/patreon/link'

        expect(json['linked']).to be true
        expect(json['premium']).to be true
        expect(json['account']).to include('name' => 'Pat Ron', 'tierName' => 'Wizard', 'hasPremium' => true, 'active' => true)
      end
    end

    context 'when not authenticated' do
      before { stub_no_auth }

      it 'returns 401' do
        get '/v1/patreon/link'

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /v1/patreon/link' do
    before { stub_authentication(user) }

    context 'when Patreon is configured' do
      before do
        allow(ENV).to receive(:fetch).and_call_original
        allow(ENV).to receive(:fetch).with('PATREON_CLIENT_ID', nil).and_return('client-123')
        allow(ENV).to receive(:fetch).with('PATREON_REDIRECT_URI', nil).and_return('https://dmguru.test/v1/patreon/callback')
      end

      it 'returns a Patreon authorize URL with a signed state for this user' do
        post '/v1/patreon/link'

        expect(response).to have_http_status(:success)
        uri = URI.parse(json['url'])
        query = Rack::Utils.parse_query(uri.query)
        expect(uri.host).to eq('www.patreon.com')
        expect(query).to include('client_id' => 'client-123', 'redirect_uri' => 'https://dmguru.test/v1/patreon/callback',
                                 'scope' => 'identity identity.memberships')
        expect(PatreonLinkState.user_for(query['state'])).to eq(user)
      end
    end

    context 'when Patreon is not configured' do
      before do
        allow(ENV).to receive(:fetch).and_call_original
        allow(ENV).to receive(:fetch).with('PATREON_CLIENT_ID', nil).and_return(nil)
      end

      it 'returns 503' do
        post '/v1/patreon/link'

        expect(response).to have_http_status(:service_unavailable)
      end
    end
  end

  describe 'DELETE /v1/patreon/link' do
    before { stub_authentication(user) }

    it 'removes the linked account' do
      create(:patreon_user, :wizard, user_id: nil, linked_user: user)

      expect do
        delete '/v1/patreon/link'
      end.to change(PatreonUser, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(user.reload.premium?).to be false
    end

    it 'leaves Foundry module logins alone' do
      create(:patreon_user, :wizard)

      expect do
        delete '/v1/patreon/link'
      end.not_to change(PatreonUser, :count)
    end
  end
end
