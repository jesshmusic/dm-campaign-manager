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
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
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

FactoryBot.define do
  factory :user do
    name { 'Jess Hendricks' }
    email { 'user@example.com' }
    password { 'testpass1234' }
    password_confirmation { 'testpass1234' }
    confirmed_at { Date.today }
    uid { 'user@example.com' }
    factory :player_user do
      role { :user }
      email { 'normal_user@example.com' }
      uid { 'normal_user@example.com' }
    end
    factory :dungeon_master_user do
      role { :moderator }
      email { 'moderator_user@example.com' }
      uid { 'moderator_user@example.com' }
    end
    factory :admin_user do
      role { :admin }
      email { 'admin_user@example.com' }
      uid { 'admin_user@example.com' }
    end
    factory :other_user do |user|
      user.first_name { Faker::Name.first_name }
      user.last_name { Faker::Name.last_name }
      user.sequence(:email) { |n| "testuser#{n}@example.com" }
      user.sequence(:uid) { |n| "testuser#{n}@example.com" }
      user.description { Faker::TvShows::TwinPeaks.quote }
    end
  end
end
