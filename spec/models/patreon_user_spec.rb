# == Schema Information
#
# Table name: patreon_users
#
#  id                    :bigint           not null, primary key
#  access_token          :string
#  email                 :string
#  expires_at            :datetime
#  has_free              :boolean          default(TRUE)
#  has_premium           :boolean          default(FALSE)
#  last_authenticated_at :datetime
#  name                  :string
#  refresh_token         :string
#  tier_name             :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  patreon_id            :string
#  user_id               :string           not null
#

require 'rails_helper'

RSpec.describe PatreonUser, type: :model do
  let(:patreon_user) { create(:patreon_user) }

  describe 'validations' do
    it { should validate_presence_of(:user_id) }
    it { should validate_uniqueness_of(:user_id) }
  end

  describe 'scopes' do
    let!(:active_user) { create(:patreon_user, expires_at: 1.week.from_now) }
    let!(:expired_user) { create(:patreon_user, :expired) }
    let!(:premium_user) { create(:patreon_user, :wizard) }
    let!(:free_user) { create(:patreon_user, :free) }

    describe '.active' do
      it 'returns only users with future expiry dates' do
        expect(PatreonUser.active).to include(active_user, premium_user)
        expect(PatreonUser.active).not_to include(expired_user)
      end
    end

    describe '.premium' do
      it 'returns only premium users' do
        expect(PatreonUser.premium).to include(premium_user)
        expect(PatreonUser.premium).not_to include(free_user)
      end
    end
  end

  describe '#authenticated?' do
    context 'when expires_at is in the future' do
      let(:user) { create(:patreon_user, expires_at: 1.day.from_now) }

      it 'returns true' do
        expect(user.authenticated?).to be true
      end
    end

    context 'when expires_at is in the past' do
      let(:user) { create(:patreon_user, :expired) }

      it 'returns false' do
        expect(user.authenticated?).to be false
      end
    end

    context 'when expires_at is nil' do
      let(:user) { create(:patreon_user, :unauthenticated) }

      it 'returns false' do
        expect(user.authenticated?).to be false
      end
    end

    context 'when expires_at is exactly now' do
      let(:user) { create(:patreon_user, expires_at: Time.current) }

      it 'returns false' do
        expect(user.authenticated?).to be false
      end
    end
  end

  describe '#as_json_for_api' do
    let(:user) do
      create(
        :patreon_user,
        user_id: 'user123',
        has_free: true,
        has_premium: false,
        tier_name: 'Apprentice',
        expires_at: Time.zone.parse('2025-12-31 23:59:59')
      )
    end

    it 'returns a hash with expected keys' do
      json = user.as_json_for_api

      expect(json).to include(
        :userId,
        :has_free,
        :has_premium,
        :tier_name,
        :expires_in
      )
    end

    it 'includes userId' do
      expect(user.as_json_for_api[:userId]).to eq('user123')
    end

    it 'includes access flags' do
      json = user.as_json_for_api
      expect(json[:has_free]).to be true
      expect(json[:has_premium]).to be false
    end

    it 'maps legacy tier names' do
      legacy_user = create(:patreon_user, tier_name: 'Adventurer')
      expect(legacy_user.as_json_for_api[:tier_name]).to eq('Wizard')

      current_user = create(:patreon_user, tier_name: 'Apprentice')
      expect(current_user.as_json_for_api[:tier_name]).to eq('Apprentice')
    end

    it 'defaults to Free when tier_name is nil' do
      user = create(:patreon_user, tier_name: nil)
      expect(user.as_json_for_api[:tier_name]).to eq('Free')
    end

    it 'converts expires_at to milliseconds' do
      # Use a specific time for testing
      user = create(:patreon_user, expires_at: Time.zone.parse('2025-01-15 12:00:00'))
      json = user.as_json_for_api

      expect(json[:expires_in]).to be_a(Integer)
      expect(json[:expires_in]).to eq((user.expires_at.to_f * 1000).to_i)
    end

    it 'returns nil for expires_in when expires_at is nil' do
      user = create(:patreon_user, :unauthenticated)
      expect(user.as_json_for_api[:expires_in]).to be_nil
    end
  end

  describe '#update_from_patreon!' do
    let(:user) { create(:patreon_user) }
    let(:patreon_data) do
      {
        patreon_id: 'new_patreon_123',
        email: 'updated@example.com',
        name: 'Updated Name',
        has_free: true,
        has_premium: true,
        tier_name: 'Wizard',
        expires_at: 1.month.from_now,
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token'
      }
    end

    it 'updates all patreon fields' do
      user.update_from_patreon!(patreon_data)

      expect(user.patreon_id).to eq('new_patreon_123')
      expect(user.email).to eq('updated@example.com')
      expect(user.name).to eq('Updated Name')
      expect(user.has_free).to be true
      expect(user.has_premium).to be true
      expect(user.tier_name).to eq('Wizard')
      expect(user.access_token).to eq('new_access_token')
      expect(user.refresh_token).to eq('new_refresh_token')
    end

    it 'updates last_authenticated_at to current time' do
      freeze_time do
        user.update_from_patreon!(patreon_data)
        expect(user.last_authenticated_at).to be_within(1.second).of(Time.current)
      end
    end

    it 'updates expires_at' do
      expected_expires_at = patreon_data[:expires_at]
      user.update_from_patreon!(patreon_data)
      expect(user.expires_at).to be_within(1.second).of(expected_expires_at)
    end

    it 'raises error if update fails' do
      allow(user).to receive(:update!).and_raise(ActiveRecord::RecordInvalid)

      expect {
        user.update_from_patreon!(patreon_data)
      }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe 'factory' do
    it 'creates a valid user' do
      expect(patreon_user).to be_valid
    end

    it 'generates unique user_ids' do
      user1 = create(:patreon_user)
      user2 = create(:patreon_user)

      expect(user1.user_id).not_to eq(user2.user_id)
    end

    describe 'traits' do
      it 'creates free tier user' do
        user = create(:patreon_user, :free)
        expect(user.has_free).to be true
        expect(user.has_premium).to be false
        expect(user.tier_name).to eq('Free')
      end

      it 'creates apprentice tier user' do
        user = create(:patreon_user, :apprentice)
        expect(user.has_free).to be true
        expect(user.has_premium).to be false
        expect(user.tier_name).to eq('Apprentice')
      end

      it 'creates wizard tier user' do
        user = create(:patreon_user, :wizard)
        expect(user.has_free).to be true
        expect(user.has_premium).to be true
        expect(user.tier_name).to eq('Wizard')
      end

      it 'creates expired user' do
        user = create(:patreon_user, :expired)
        expect(user.expires_at).to be < Time.current
      end

      it 'creates unauthenticated user' do
        user = create(:patreon_user, :unauthenticated)
        expect(user.access_token).to be_nil
        expect(user.refresh_token).to be_nil
        expect(user.expires_at).to be_nil
        expect(user.last_authenticated_at).to be_nil
      end
    end
  end
end
