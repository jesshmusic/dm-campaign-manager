require 'rails_helper'

RSpec.describe PatreonLinkState do
  let(:user) { create(:dungeon_master_user) }

  describe '.generate' do
    it 'creates a prefixed state that resolves to the user' do
      state = described_class.generate(user)

      expect(state).to start_with(PatreonLinkState::PREFIX)
      expect(described_class.user_for(state)).to eq(user)
    end
  end

  describe '.link_state?' do
    it 'recognizes web link states' do
      expect(described_class.link_state?(described_class.generate(user))).to be true
    end

    it 'does not treat Foundry module user ids as link states' do
      expect(described_class.link_state?('aB3dE5gH7jK9mN1p')).to be false
      expect(described_class.link_state?(nil)).to be false
    end
  end

  describe '.user_for' do
    it 'returns nil for a tampered state' do
      expect(described_class.user_for("#{described_class.generate(user)}x")).to be_nil
    end

    it 'returns nil for garbage' do
      expect(described_class.user_for("#{PatreonLinkState::PREFIX}garbage")).to be_nil
    end

    it 'returns nil once the state expires' do
      state = described_class.generate(user)

      travel PatreonLinkState::TTL + 1.second do
        expect(described_class.user_for(state)).to be_nil
      end
    end

    it 'returns nil when the user no longer exists' do
      state = described_class.generate(user)
      user.destroy

      expect(described_class.user_for(state)).to be_nil
    end
  end
end
