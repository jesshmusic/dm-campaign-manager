# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :inet
#  deleted_at             :datetime
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  info                   :text
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
#  location               :string
#  name                   :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :integer
#  sign_in_count          :integer          default(0), not null
#  slug                   :string
#  unconfirmed_email      :string
#  username               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

require 'rails_helper'

RSpec.describe User, type: :model do
  let!(:user) {create :user}

  context 'Defaults' do
    it 'should set role to "Dungeon Master"' do
      expect(user.role == :dungeon_master)
    end

    it 'should set slug to "test-dm"' do
      expect(user.slug).to eq('jesshmusic')
    end

    it 'should return true for active_for_authentication' do
      expect(user.active_for_authentication?).to eq(true)
    end

    it 'should return :active for the inactive_message' do
      expect(user.inactive_message).to eq(:active)
    end

    it 'should return the slug for to_param' do
      expect(user.to_param).to eq('jesshmusic')
    end
  end

  context 'Soft Deletes' do
    before(:each) do
      user.soft_delete
      user.reload
    end
    it 'should not delete a user' do
      expect(User.all.count).to eq(1)
    end

    it 'should set deleted_at instead of deleting the user' do
      expect(user.deleted_at).not_to be_nil
    end

    it 'should return false for active_for_authentication' do
      expect(user.active_for_authentication?).to eq(false)
    end

    it 'should return :deleted_account for the inactive_message' do
      expect(user.inactive_message).to eq(:deleted_account)
    end
  end
end
