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

FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:username) { |n| "user#{n}" }
    sequence(:auth_id) { |n| "auth0|#{SecureRandom.hex(12)}_#{n}" }
    confirmed_at { Date.today }
    role { :user }

    factory :dungeon_master_user do
      role { :dungeon_master }
      sequence(:name) { |n| "DM #{n}" }
      sequence(:email) { |n| "dm#{n}@example.com" }
      sequence(:username) { |n| "dm#{n}" }
      sequence(:auth_id) { |n| "auth0|dm_#{SecureRandom.hex(12)}_#{n}" }
    end

    factory :admin_user do
      role { :admin }
      sequence(:name) { |n| "Admin #{n}" }
      sequence(:email) { |n| "admin#{n}@example.com" }
      sequence(:username) { |n| "admin#{n}" }
      sequence(:auth_id) { |n| "auth0|admin_#{SecureRandom.hex(12)}_#{n}" }
    end

    factory :other_user do |user|
      role { :dungeon_master }
      user.name { Faker::Name.first_name }
      user.sequence(:email) { |n| "testuser#{n}@example.com" }
      user.sequence(:username) { |n| "testuser#{n}" }
      user.sequence(:auth_id) { |n| "auth0|other_#{SecureRandom.hex(12)}_#{n}" }
    end
  end
end
