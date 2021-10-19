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
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

FactoryBot.define do
  factory :user do
    name { 'Jess Hendricks' }
    email { 'user@example.com' }
    username { 'jesshmusic1' }
    confirmed_at { Date.today }
    factory :dungeon_master_user do
      role { :dungeon_master }
      email { 'dm_user@example.com' }
      username { 'jesshdm1' }
    end
    factory :admin_user do
      role { :admin }
      email { 'admin_user@example.com' }
      username { 'jesshadmin1' }
    end
    factory :other_user do |user|
      role { :dungeon_master }
      user.name { Faker::Name.first_name }
      user.sequence(:email) { |n| "testuser#{n}@example.com" }
      user.sequence(:username) { |n| "testuser#{n}" }
    end
  end
end
