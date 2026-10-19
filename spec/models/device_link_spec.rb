require 'rails_helper'

RSpec.describe DeviceLink, type: :model do
  let(:user) { create(:dungeon_master_user, name: 'Dorman Lakely') }

  describe '.start!' do
    it 'returns the device code once and stores only its digest' do
      link = described_class.start!(world_id: 'abc123', world_title: 'Dev')

      expect(link.device_code.length).to be >= 40
      expect(link.device_code_digest).to eq(described_class.digest(link.device_code))
      expect(link.device_code_digest).not_to include(link.device_code)
      expect(described_class.find(link.id).device_code).to be_nil
    end

    it 'makes an 8-character user code from the unambiguous alphabet' do
      link = described_class.start!

      expect(link.user_code).to match(/\A[A-HJKMNP-Z2-9]{8}\z/)
      expect(link.user_code).not_to match(/[01OIL]/)
    end

    it 'records the world and expires in 10 minutes' do
      freeze_time do
        link = described_class.start!(world_id: 'abc123', world_title: '  The   Sunless  Citadel ')

        expect(link.world_id).to eq('abc123')
        expect(link.world_title).to eq('The Sunless Citadel')
        expect(link.expires_at).to eq(10.minutes.from_now)
      end
    end

    it 'works without a world' do
      link = described_class.start!

      expect(link.world_id).to be_nil
      expect(link.world_title).to be_nil
    end

    it 'shortens a very long world title' do
      link = described_class.start!(world_title: 'x' * 500)

      expect(link.world_title.length).to eq(DeviceLink::WORLD_TITLE_MAX_LENGTH)
    end

    it 'gives each link a different device code' do
      first = described_class.start!
      second = described_class.start!

      expect(first.device_code).not_to eq(second.device_code)
    end

    it 'deletes expired links' do
      old = described_class.start!
      old.update!(expires_at: 1.minute.ago)

      described_class.start!

      expect(described_class.exists?(old.id)).to be false
    end

    it 'tries a new user code when one clashes with a pending link' do
      described_class.start!
      taken = described_class.last.user_code
      allow(described_class).to receive(:generate_user_code).and_return(taken, 'ABCDEFGH')

      link = described_class.start!

      expect(link.user_code).to eq('ABCDEFGH')
    end

    it 'reuses a code that a consumed link had' do
      first = described_class.start!
      first.update!(consumed_at: Time.current)
      allow(described_class).to receive(:generate_user_code).and_return(first.user_code)

      expect(described_class.start!.user_code).to eq(first.user_code)
    end
  end

  describe '.find_pending_by_user_code' do
    let!(:link) { described_class.start!(world_title: 'Dev') }

    it 'accepts the code with or without the dash, in any case' do
      dashed = link.display_user_code

      expect(described_class.find_pending_by_user_code(dashed)).to eq(link)
      expect(described_class.find_pending_by_user_code(link.user_code.downcase)).to eq(link)
      expect(described_class.find_pending_by_user_code(" #{dashed.downcase} ")).to eq(link)
    end

    it 'ignores codes of the wrong length' do
      expect(described_class.find_pending_by_user_code(link.user_code.first(7))).to be_nil
      expect(described_class.find_pending_by_user_code(nil)).to be_nil
    end

    it 'ignores expired, approved, denied and consumed links' do
      link.update!(expires_at: 1.second.ago)
      expect(described_class.find_pending_by_user_code(link.user_code)).to be_nil

      link.update!(expires_at: 5.minutes.from_now, approved_at: Time.current, user: user)
      expect(described_class.find_pending_by_user_code(link.user_code)).to be_nil

      link.update!(approved_at: nil, denied_at: Time.current)
      expect(described_class.find_pending_by_user_code(link.user_code)).to be_nil

      link.update!(denied_at: nil, consumed_at: Time.current)
      expect(described_class.find_pending_by_user_code(link.user_code)).to be_nil
    end
  end

  describe '.for_device_code' do
    it 'finds the link by its device code' do
      link = described_class.start!

      expect(described_class.for_device_code(link.device_code)).to eq(link)
      expect(described_class.for_device_code('nope')).to be_nil
      expect(described_class.for_device_code('')).to be_nil
    end
  end

  describe '#display_user_code' do
    it 'puts a dash in the middle' do
      link = described_class.new(user_code: 'WXYZ2345')

      expect(link.display_user_code).to eq('WXYZ-2345')
    end
  end

  describe '#approve! and #deny!' do
    let(:link) { described_class.start!(world_title: 'Dev') }

    it 'binds an approved link to the user' do
      expect(link.approve!(user)).to be_truthy

      expect(link.reload.user).to eq(user)
      expect(link.approved_at).to be_present
    end

    it 'records a denial' do
      expect(link.deny!).to be_truthy

      expect(link.reload.denied_at).to be_present
      expect(link.user).to be_nil
    end

    it 'does nothing once the link is no longer pending' do
      link.deny!

      expect(link.approve!(user)).to be false
      expect(link.reload.approved_at).to be_nil
    end

    it 'does nothing once the link has expired' do
      link.update!(expires_at: 1.second.ago)

      expect(link.deny!).to be false
    end
  end

  describe '#api_token_name' do
    it 'names the token after the world' do
      expect(described_class.new(world_title: 'Dev').api_token_name).to eq('Foundry: Dev')
    end

    it 'falls back to Foundry' do
      expect(described_class.new.api_token_name).to eq('Foundry')
    end

    it 'fits the API token name limit' do
      expect(described_class.new(world_title: 'x' * 200).api_token_name.length).to eq(100)
    end
  end

  describe '#poll!' do
    let(:link) { described_class.start!(world_title: 'Dev') }

    it 'is pending until the user approves' do
      expect(link.poll!).to eq([:pending])
      expect(link.reload.last_polled_at).to be_present
    end

    it 'asks the module to slow down when it polls faster than the interval' do
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 0) do
        expect(link.poll!).to eq([:pending])
      end
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 2) do
        expect(link.poll!).to eq([:slow_down])
      end
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 7) do
        expect(link.poll!).to eq([:pending])
      end
    end

    it 'allows a poll that is up to a second early' do
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 0) do
        link.poll!
      end
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 4, 500_000) do
        expect(link.poll!).to eq([:pending])
      end
    end

    it 'issues an API token for the approving user exactly once' do
      link.approve!(user)

      status, token = link.poll!

      expect(status).to eq(:approved)
      expect(token.user).to eq(user)
      expect(token.name).to eq('Foundry: Dev')
      expect(ApiToken.authenticate(token.plaintext_token)).to eq(token)
      expect(link.reload.consumed_at).to be_present
      expect(link.poll!).to eq([:expired])
      expect(user.api_tokens.count).to eq(1)
    end

    it 'gives the token even if the module polls quickly after approval' do
      link.poll!
      link.approve!(user)

      expect(link.poll!.first).to eq(:approved)
    end

    it 'reports a denial' do
      link.deny!

      expect(link.poll!).to eq([:denied])
    end

    it 'reports an expired link' do
      link.update!(expires_at: 1.second.ago)

      expect(link.poll!).to eq([:expired])
    end

    it 'denies the link when the user has run out of API tokens' do
      link.approve!(user)
      ApiToken::MAX_PER_USER.times { |i| ApiToken.issue!(user: user, name: "Token #{i}") }

      expect(link.poll!).to eq([:denied])
      expect(link.reload.consumed_at).to be_present
      expect(user.api_tokens.count).to eq(ApiToken::MAX_PER_USER)
    end
  end

  describe '#as_json_for_approval' do
    it 'shows the dashed code, the world and when it expires' do
      link = described_class.start!(world_title: 'Dev')

      expect(link.as_json_for_approval).to eq(
        userCode: link.display_user_code,
        worldTitle: 'Dev',
        expiresAt: link.expires_at.iso8601
      )
    end
  end

  describe 'when the user is deleted' do
    it 'deletes their links' do
      link = described_class.start!
      link.approve!(user)

      user.destroy

      expect(described_class.exists?(link.id)).to be false
    end
  end
end
