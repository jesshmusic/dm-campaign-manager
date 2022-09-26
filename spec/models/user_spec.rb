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
#  unconfirmed_email      :string
#  username               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  auth_id                :string           default(""), not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

require 'rails_helper'

RSpec.describe User, type: :model do
  let!(:user) { create :user }

  context 'Defaults' do
    it 'should set role to "Dungeon Master"' do
      expect(user.role == :dungeon_master)
    end
  end

  context 'Soft Deletes' do
    before(:each) do
      user.soft_delete
      user.reload
    end
    it 'should not delete a user' do
      expect(User.all.count).to eq(4)
    end

    it 'should set deleted_at instead of deleting the user' do
      expect(user.deleted_at).not_to be_nil
    end
  end
end
