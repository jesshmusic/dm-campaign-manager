require 'rails_helper'

RSpec.describe PatreonMembership do
  include PatreonHttpStubs

  let(:dm) { create(:dungeon_master_user) }
  let(:account) do
    create(:patreon_user, :wizard, user_id: nil, linked_user: dm, expires_at: 2.days.ago,
                                   access_token: 'old_access', refresh_token: 'old_refresh')
  end

  def snapshot(record)
    record.reload.attributes.except('updated_at')
  end

  describe '.attributes' do
    it 'maps a $5+ membership to premium and keeps the tier name' do
      attributes = described_class.attributes(patreon_token_body, patreon_identity_body(cents: 500, tier: 'Wizard'))

      expect(attributes).to include(patreon_id: 'patreon_123', email: 'patron@example.com', name: 'Pat Ron',
                                    has_free: true, has_premium: true, tier_name: 'Wizard',
                                    access_token: 'new_access_token', refresh_token: 'new_refresh_token')
    end

    it 'maps a smaller pledge to free access' do
      attributes = described_class.attributes(patreon_token_body, patreon_identity_body(cents: 300, tier: 'Apprentice'))

      expect(attributes).to include(has_premium: false, tier_name: 'Apprentice')
    end

    it 'treats no membership as Free' do
      identity = patreon_identity_body.merge('included' => [])

      expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false, tier_name: 'Free')
    end

    it 'maps the legacy Adventurer tier to Wizard' do
      attributes = described_class.attributes(patreon_token_body, patreon_identity_body(tier: 'Adventurer'))

      expect(attributes[:tier_name]).to eq('Wizard')
    end

    it 'does not count a pledge to another creator' do
      identity = patreon_identity_body(cents: 1000, tier: 'Gold', campaign_id: 'someone_else')

      expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false, tier_name: 'Free')
    end

    it 'reads premium and the tier from our membership among several' do
      memberships = [
        patreon_membership(id: 'theirs', cents: 2000, tier: 'Gold', campaign_id: 'someone_else'),
        patreon_membership(id: 'ours', cents: 500, tier: 'Wizard')
      ]
      identity = patreon_identity_body(memberships: memberships)

      expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: true, tier_name: 'Wizard')
    end

    it 'ignores a premium pledge elsewhere when our membership is smaller' do
      memberships = [
        patreon_membership(id: 'theirs', cents: 2000, tier: 'Gold', campaign_id: 'someone_else'),
        patreon_membership(id: 'ours', cents: 300, tier: 'Apprentice')
      ]
      identity = patreon_identity_body(memberships: memberships)

      expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false, tier_name: 'Apprentice')
    end

    %w[declined_patron former_patron].each do |status|
      it "does not give a #{status} premium or their old tier" do
        identity = patreon_identity_body(cents: 500, tier: 'Wizard', status: status)

        expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false, tier_name: 'Free')
      end
    end

    it 'does not give a follower who never pledged premium' do
      identity = patreon_identity_body(cents: 500, tier: nil, status: nil)

      expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false, tier_name: 'Free')
    end

    context 'without PATREON_CAMPAIGN_ID' do
      before do
        stub_patreon_campaign_id(nil)
        described_class.instance_variable_set(:@campaign_id_warning_logged, false)
        allow(Rails.logger).to receive(:warn)
      end

      after { described_class.instance_variable_set(:@campaign_id_warning_logged, false) }

      it 'falls back to the first membership' do
        memberships = [
          patreon_membership(id: 'first', cents: 500, tier: 'Gold', campaign_id: 'someone_else'),
          patreon_membership(id: 'second', cents: 0, tier: 'Free')
        ]
        identity = patreon_identity_body(memberships: memberships)

        expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: true, tier_name: 'Gold')
      end

      it 'still requires an active patron' do
        identity = patreon_identity_body(cents: 500, status: 'declined_patron')

        expect(described_class.attributes(patreon_token_body, identity)).to include(has_premium: false)
      end

      it 'warns once' do
        2.times { described_class.attributes(patreon_token_body, patreon_identity_body) }

        expect(Rails.logger).to have_received(:warn).with(/PATREON_CAMPAIGN_ID is not set/).once
      end
    end

    it 'expires when the token does' do
      freeze_time do
        attributes = described_class.attributes(patreon_token_body(expires_in: 2_678_400), patreon_identity_body)

        expect(attributes[:expires_at]).to eq(31.days.from_now)
      end
    end

    it 'falls back to 30 days when Patreon gives no token lifetime' do
      freeze_time do
        attributes = described_class.attributes(patreon_token_body(expires_in: nil), patreon_identity_body)

        expect(attributes[:expires_at]).to eq(30.days.from_now)
      end
    end
  end

  describe '.refresh' do
    context 'when Patreon renews the token' do
      before { stub_patreon_http(token: [200, patreon_token_body], identity: [200, patreon_identity_body(cents: 500)]) }

      it 'stores the new tokens and expiry' do
        freeze_time do
          expect(described_class.refresh(account)).to eq(:refreshed)

          account.reload
          expect(account.access_token).to eq('new_access_token')
          expect(account.refresh_token).to eq('new_refresh_token')
          expect(account.expires_at).to eq(31.days.from_now)
          expect(account.last_authenticated_at).to eq(Time.current)
        end
      end

      it 'restores premium for a paying patron' do
        expect(account.premium_active?).to be false

        described_class.refresh(account)

        expect(account.reload.premium_active?).to be true
        expect(dm.reload.premium?).to be true
      end

      it 'sends the stored refresh token and reads the membership with the new access token' do
        requests = stub_patreon_http(token: [200, patreon_token_body], identity: [200, patreon_identity_body])

        described_class.refresh(account)

        expect(Rack::Utils.parse_query(requests.first.body)).to include('grant_type' => 'refresh_token', 'refresh_token' => 'old_refresh')
        expect(requests.second['Authorization']).to eq('Bearer new_access_token')
      end

      it 'keeps the old refresh token if Patreon does not send a new one' do
        stub_patreon_http(token: [200, patreon_token_body(refresh_token: nil)], identity: [200, patreon_identity_body])

        described_class.refresh(account)

        expect(account.reload.refresh_token).to eq('old_refresh')
      end
    end

    context 'when the patron has dropped below the premium tier' do
      before do
        stub_patreon_http(token: [200, patreon_token_body],
                          identity: [200, patreon_identity_body(cents: 0, tier: 'Free')])
      end

      it 'renews the token but drops premium' do
        expect(described_class.refresh(account)).to eq(:refreshed)

        account.reload
        expect(account.authenticated?).to be true
        expect(account.has_premium).to be false
        expect(account.tier_name).to eq('Free')
      end
    end

    context 'when Patreon has revoked the refresh token' do
      before { stub_patreon_http(token: [400, { 'error' => 'invalid_grant' }]) }

      it 'drops premium and the dead tokens but keeps the account for re-linking' do
        expect(described_class.refresh(account)).to eq(:revoked)

        account.reload
        expect(account.premium_active?).to be false
        expect(account.has_premium).to be false
        expect(account.expires_at).to be_nil
        expect(account.access_token).to be_nil
        expect(account.refresh_token).to be_nil
        expect(account.linked_user).to eq(dm)
        expect(dm.reload.premium?).to be false
      end
    end

    context 'when Patreon answers 401' do
      before { stub_patreon_http(token: [401, { 'error' => 'invalid_client' }]) }

      it 'treats the token as revoked' do
        expect(described_class.refresh(account)).to eq(:revoked)
        expect(account.reload.has_premium).to be false
      end
    end

    context 'when the network fails' do
      before { stub_patreon_http(token: Net::ReadTimeout.new('read timeout')) }

      it 'leaves the account unchanged and logs the failure' do
        original = snapshot(account)
        allow(Rails.logger).to receive(:error)

        expect(described_class.refresh(account)).to eq(:failed)

        expect(snapshot(account)).to eq(original)
        expect(Rails.logger).to have_received(:error).with(/Patreon refresh failed for PatreonUser #{account.id}/)
      end
    end

    context 'when Patreon returns a 5xx' do
      before { stub_patreon_http(token: [502, 'Bad Gateway']) }

      it 'leaves the account unchanged' do
        original = snapshot(account)

        expect(described_class.refresh(account)).to eq(:failed)
        expect(snapshot(account)).to eq(original)
      end
    end

    context 'when the token refresh works but the membership fetch fails' do
      before { stub_patreon_http(token: [200, patreon_token_body], identity: [500, 'oops']) }

      it 'keeps the rotated tokens but leaves premium and expiry alone' do
        expires_at = account.expires_at

        expect(described_class.refresh(account)).to eq(:failed)

        account.reload
        expect(account.refresh_token).to eq('new_refresh_token')
        expect(account.has_premium).to be true
        expect(account.expires_at).to be_within(1.second).of(expires_at)
      end
    end

    context 'when another request refreshed the account first' do
      it 'skips it rather than spending the rotated-away token' do
        stale_copy = PatreonUser.find(account.id)
        account.update!(refresh_token: 'rotated_elsewhere')
        allow(PatreonClient).to receive(:refresh_tokens)

        expect(described_class.refresh(stale_copy)).to eq(:skipped)

        expect(PatreonClient).not_to have_received(:refresh_tokens)
        expect(stale_copy.refresh_token).to eq('rotated_elsewhere')
      end
    end
  end

  describe '.refresh_due' do
    it 'refreshes each account and counts the outcomes' do
      revoked = create(:patreon_user, refresh_token: 'revoked_refresh', expires_at: 1.day.from_now)
      healthy = create(:patreon_user, refresh_token: 'good_refresh', expires_at: 1.day.from_now)
      allow(PatreonClient).to receive(:refresh_tokens).with('revoked_refresh').and_raise(PatreonClient::RevokedError, 'invalid_grant')
      allow(PatreonClient).to receive(:refresh_tokens).with('good_refresh').and_return(patreon_token_body)
      allow(PatreonClient).to receive(:identity).and_return(patreon_identity_body)

      counts = described_class.refresh_due(PatreonUser.where(id: [revoked.id, healthy.id]))

      expect(counts).to eq(refreshed: 1, revoked: 1, failed: 0, skipped: 0)
    end

    it 'keeps going when one account blows up' do
      broken = create(:patreon_user, expires_at: 1.day.from_now)
      healthy = create(:patreon_user, expires_at: 1.day.from_now)
      allow(described_class).to receive(:refresh).and_call_original
      allow(described_class).to receive(:refresh).with(broken).and_raise(RuntimeError, 'boom')
      allow(PatreonClient).to receive_messages(refresh_tokens: patreon_token_body, identity: patreon_identity_body)

      counts = nil
      expect { counts = described_class.refresh_due(PatreonUser.where(id: [broken.id, healthy.id]).order(:id)) }.not_to raise_error

      expect(counts).to eq(refreshed: 1, revoked: 0, failed: 1, skipped: 0)
      expect(healthy.reload.access_token).to eq('new_access_token')
    end
  end

  describe '.refresh_if_stale' do
    let(:cache) { ActiveSupport::Cache::MemoryStore.new }

    before { allow(Rails).to receive(:cache).and_return(cache) }

    it 'refreshes an expired account' do
      allow(described_class).to receive(:refresh).and_return(:refreshed)

      expect(described_class.refresh_if_stale(account)).to eq(:refreshed)
      expect(described_class).to have_received(:refresh).with(account)
    end

    it 'refreshes an account that expires within a day' do
      account.update!(expires_at: 12.hours.from_now)
      allow(described_class).to receive(:refresh).and_return(:refreshed)

      described_class.refresh_if_stale(account)

      expect(described_class).to have_received(:refresh).with(account)
    end

    it 'leaves a fresh account alone' do
      account.update!(expires_at: 3.days.from_now)
      allow(described_class).to receive(:refresh)

      expect(described_class.refresh_if_stale(account)).to be_nil
      expect(described_class).not_to have_received(:refresh)
    end

    it 'skips an account without a refresh token' do
      account.update!(refresh_token: nil)
      allow(described_class).to receive(:refresh)

      described_class.refresh_if_stale(account)

      expect(described_class).not_to have_received(:refresh)
    end

    it 'does nothing without an account' do
      expect(described_class.refresh_if_stale(nil)).to be_nil
    end

    it 'tries at most once an hour per account' do
      other = create(:patreon_user, expires_at: 1.day.ago)
      allow(described_class).to receive(:refresh).and_return(:failed)

      2.times { described_class.refresh_if_stale(account) }
      described_class.refresh_if_stale(other)
      expect(described_class).to have_received(:refresh).with(account).once
      expect(described_class).to have_received(:refresh).with(other).once

      travel(described_class::LAZY_REFRESH_INTERVAL + 1.minute) { described_class.refresh_if_stale(account) }
      expect(described_class).to have_received(:refresh).with(account).twice
    end
  end
end
