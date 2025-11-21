require 'rails_helper'

RSpec.describe PatreonUser, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:patreon_user)).to be_valid
    end
  end

  describe 'validations' do
    it 'requires user_id presence' do
      patreon_user = build(:patreon_user, user_id: nil)
      expect(patreon_user).not_to be_valid
      expect(patreon_user.errors[:user_id]).to include("can't be blank")
    end

    it 'requires unique user_id' do
      create(:patreon_user, user_id: 'user_123')
      patreon_user = build(:patreon_user, user_id: 'user_123')
      expect(patreon_user).not_to be_valid
      expect(patreon_user.errors[:user_id]).to include('has already been taken')
    end
  end

  describe 'scopes' do
    let!(:active_user) { create(:patreon_user, expires_at: 1.day.from_now) }
    let!(:expired_user) { create(:patreon_user, expires_at: 1.day.ago) }
    let!(:premium_user) { create(:patreon_user, has_premium: true, expires_at: 1.day.from_now) }
    let!(:free_user) { create(:patreon_user, has_premium: false, expires_at: 1.day.from_now) }

    describe '.active' do
      it 'returns users with future expires_at' do
        expect(PatreonUser.active).to include(active_user)
        expect(PatreonUser.active).not_to include(expired_user)
      end
    end

    describe '.premium' do
      it 'returns users with has_premium true' do
        expect(PatreonUser.premium).to include(premium_user)
        expect(PatreonUser.premium).not_to include(free_user)
      end
    end
  end

  describe '#authenticated?' do
    it 'returns true when expires_at is in the future' do
      patreon_user = create(:patreon_user, expires_at: 1.hour.from_now)
      expect(patreon_user.authenticated?).to be true
    end

    it 'returns false when expires_at is in the past' do
      patreon_user = create(:patreon_user, expires_at: 1.hour.ago)
      expect(patreon_user.authenticated?).to be false
    end

    it 'returns false when expires_at is nil' do
      patreon_user = create(:patreon_user, expires_at: nil)
      expect(patreon_user.authenticated?).to be false
    end
  end

  describe '#as_json_for_api' do
    it 'returns correctly formatted JSON' do
      patreon_user = create(:patreon_user,
                           user_id: 'user_123',
                           has_free: true,
                           has_premium: false,
                           tier_name: 'Free',
                           expires_at: Time.zone.parse('2025-12-31 23:59:59'))

      json = patreon_user.as_json_for_api

      expect(json[:userId]).to eq('user_123')
      expect(json[:has_free]).to be true
      expect(json[:has_premium]).to be false
      expect(json[:tier_name]).to eq('Free')
      expect(json[:expires_in]).to be_a(Integer)
    end

    it 'maps legacy "Adventurer" tier to "Wizard"' do
      patreon_user = create(:patreon_user, tier_name: 'Adventurer')
      json = patreon_user.as_json_for_api
      expect(json[:tier_name]).to eq('Wizard')
    end

    it 'defaults to "Free" when tier_name is nil' do
      patreon_user = create(:patreon_user, tier_name: nil)
      json = patreon_user.as_json_for_api
      expect(json[:tier_name]).to eq('Free')
    end

    it 'returns nil for expires_in when expires_at is nil' do
      patreon_user = create(:patreon_user, expires_at: nil)
      json = patreon_user.as_json_for_api
      expect(json[:expires_in]).to be_nil
    end

    it 'converts expires_at to milliseconds' do
      expires = Time.zone.parse('2025-12-31 12:00:00')
      patreon_user = create(:patreon_user, expires_at: expires)
      json = patreon_user.as_json_for_api
      expect(json[:expires_in]).to eq((expires.to_f * 1000).to_i)
    end
  end

  describe '#update_from_patreon!' do
    let(:patreon_user) { create(:patreon_user) }
    let(:new_expires_at) { 1.month.from_now }
    let(:patreon_data) do
      {
        patreon_id: 'patreon_456',
        email: 'new@example.com',
        name: 'New Name',
        has_free: false,
        has_premium: true,
        tier_name: 'Wizard',
        expires_at: new_expires_at,
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token'
      }
    end

    it 'updates all patreon data fields' do
      freeze_time do
        patreon_user.update_from_patreon!(patreon_data)

        expect(patreon_user.patreon_id).to eq('patreon_456')
        expect(patreon_user.email).to eq('new@example.com')
        expect(patreon_user.name).to eq('New Name')
        expect(patreon_user.has_free).to be false
        expect(patreon_user.has_premium).to be true
        expect(patreon_user.tier_name).to eq('Wizard')
        expect(patreon_user.expires_at).to eq(new_expires_at)
        expect(patreon_user.access_token).to eq('new_access_token')
        expect(patreon_user.refresh_token).to eq('new_refresh_token')
        expect(patreon_user.last_authenticated_at).to eq(Time.current)
      end
    end

    it 'updates last_authenticated_at to current time' do
      freeze_time do
        patreon_user.update_from_patreon!(patreon_data)
        expect(patreon_user.last_authenticated_at).to be_within(1.second).of(Time.current)
      end
    end
  end
end
