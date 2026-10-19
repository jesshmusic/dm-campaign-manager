require 'rails_helper'

RSpec.describe 'Admin::V1::PatreonWebhooksController', type: :request do
  include PatreonHttpStubs

  let(:secret) { 'webhook-secret' }
  let(:patreon_id) { 'patreon_123' }
  let(:dm) { create(:dungeon_master_user) }
  let!(:account) do
    create(:patreon_user, :wizard, user_id: nil, linked_user: dm, patreon_id: patreon_id, refresh_token: 'old_refresh')
  end

  before do
    allow(ENV).to receive(:fetch).with('PATREON_WEBHOOK_SECRET', nil).and_return(secret)
    allow(PatreonMembership).to receive(:refresh).and_call_original
  end

  # What Patreon sends: the member, with its user and campaign
  def member_payload(user_id: patreon_id, status: 'former_patron', cents: 0)
    {
      'data' => {
        'id' => 'member_1',
        'type' => 'member',
        'attributes' => { 'patron_status' => status, 'currently_entitled_amount_cents' => cents },
        'relationships' => {
          'user' => { 'data' => { 'id' => user_id, 'type' => 'user' } },
          'campaign' => { 'data' => { 'id' => PatreonHttpStubs::PATREON_CAMPAIGN_ID, 'type' => 'campaign' } }
        }
      },
      'included' => []
    }.to_json
  end

  def sign(body, key = secret)
    OpenSSL::HMAC.hexdigest('MD5', key, body)
  end

  def deliver(event, body = member_payload, signature: sign(body))
    headers = { 'CONTENT_TYPE' => 'application/json', 'X-Patreon-Event' => event }
    headers['X-Patreon-Signature'] = signature if signature
    post '/v1/patreon/webhook', params: body, headers: headers
  end

  describe 'POST /v1/patreon/webhook' do
    context 'when a patron cancels' do
      before do
        stub_patreon_http(token: [200, patreon_token_body],
                          identity: [200, patreon_identity_body(cents: 0, tier: nil, status: 'former_patron')])
      end

      it 're-reads the membership from Patreon and drops premium' do
        expect(dm.premium?).to be true

        deliver('members:pledge:delete')

        expect(response).to have_http_status(:ok)
        expect(PatreonMembership).to have_received(:refresh).with(account)
        expect(account.reload).to have_attributes(has_premium: false, tier_name: 'Free', refresh_token: 'new_refresh_token')
        expect(dm.reload.premium?).to be false
      end
    end

    context 'when a patron pledges' do
      let!(:account) do
        create(:patreon_user, :free, user_id: nil, linked_user: dm, patreon_id: patreon_id, refresh_token: 'old_refresh')
      end

      before { stub_patreon_http(token: [200, patreon_token_body], identity: [200, patreon_identity_body(cents: 500)]) }

      it 'grants premium' do
        deliver('members:pledge:create', member_payload(status: 'active_patron', cents: 500))

        expect(response).to have_http_status(:ok)
        expect(account.reload).to have_attributes(has_premium: true, tier_name: 'Wizard')
      end
    end

    %w[
      members:create members:update members:delete
      members:pledge:create members:pledge:update members:pledge:delete
    ].each do |event|
      it "refreshes the membership on #{event}" do
        allow(PatreonMembership).to receive(:refresh).and_return(:refreshed)

        deliver(event)

        expect(response).to have_http_status(:ok)
        expect(PatreonMembership).to have_received(:refresh).with(account)
      end
    end

    it 'refreshes every login that shares the Patreon user' do
      foundry_login = create(:patreon_user, :wizard, patreon_id: patreon_id)
      create(:patreon_user, :wizard, patreon_id: 'someone_else')
      allow(PatreonMembership).to receive(:refresh).and_return(:refreshed)

      deliver('members:update')

      expect(PatreonMembership).to have_received(:refresh).twice
      expect(PatreonMembership).to have_received(:refresh).with(account)
      expect(PatreonMembership).to have_received(:refresh).with(foundry_login)
    end

    context 'when the account has no refresh token' do
      before { account.update!(refresh_token: nil) }

      it 'drops premium on a cancellation' do
        deliver('members:pledge:delete')

        expect(response).to have_http_status(:ok)
        expect(PatreonMembership).not_to have_received(:refresh)
        expect(account.reload.has_premium).to be false
      end

      it 'leaves premium alone on other events' do
        deliver('members:pledge:update')

        expect(response).to have_http_status(:ok)
        expect(account.reload.has_premium).to be true
      end
    end

    context 'when Patreon cannot be reached' do
      before { stub_patreon_http(token: SocketError.new('getaddrinfo failed')) }

      it 'still drops premium on a cancellation' do
        deliver('members:delete')

        expect(response).to have_http_status(:ok)
        expect(account.reload.has_premium).to be false
      end

      it 'leaves premium alone on an update' do
        deliver('members:update')

        expect(response).to have_http_status(:ok)
        expect(account.reload.has_premium).to be true
      end
    end

    it 'ignores events it does not handle' do
      deliver('posts:publish')

      expect(response).to have_http_status(:ok)
      expect(PatreonMembership).not_to have_received(:refresh)
    end

    it 'ignores patrons it does not know' do
      deliver('members:pledge:delete', member_payload(user_id: 'stranger'))

      expect(response).to have_http_status(:ok)
      expect(PatreonMembership).not_to have_received(:refresh)
      expect(account.reload.has_premium).to be true
    end

    it 'ignores a payload without a member user' do
      body = { 'data' => { 'type' => 'member' } }.to_json

      deliver('members:pledge:delete', body)

      expect(response).to have_http_status(:ok)
      expect(PatreonMembership).not_to have_received(:refresh)
    end

    it 'ignores an unreadable body' do
      deliver('members:pledge:delete', 'not json')

      expect(response).to have_http_status(:ok)
      expect(PatreonMembership).not_to have_received(:refresh)
    end

    it 'does not need a signed-in user or a CSRF token' do
      ActionController::Base.allow_forgery_protection = true
      deliver('members:update')

      expect(response).to have_http_status(:ok)
    ensure
      ActionController::Base.allow_forgery_protection = false
    end

    context 'with a bad signature' do
      it 'rejects a signature made with another secret' do
        deliver('members:pledge:delete', member_payload, signature: sign(member_payload, 'wrong-secret'))

        expect(response).to have_http_status(:unauthorized)
        expect(PatreonMembership).not_to have_received(:refresh)
        expect(account.reload.has_premium).to be true
      end

      it 'rejects a body changed after signing' do
        deliver('members:pledge:delete', member_payload(user_id: 'patreon_999'), signature: sign(member_payload))

        expect(response).to have_http_status(:unauthorized)
      end

      it 'rejects a missing signature' do
        deliver('members:pledge:delete', member_payload, signature: nil)

        expect(response).to have_http_status(:unauthorized)
      end
    end

    it 'rejects everything when the webhook secret is not set' do
      allow(ENV).to receive(:fetch).with('PATREON_WEBHOOK_SECRET', nil).and_return(nil)

      deliver('members:pledge:delete', member_payload, signature: sign(member_payload, ''))

      expect(response).to have_http_status(:unauthorized)
      expect(PatreonMembership).not_to have_received(:refresh)
    end
  end
end
