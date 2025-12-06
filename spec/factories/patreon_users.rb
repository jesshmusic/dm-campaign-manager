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
# Indexes
#
#  index_patreon_users_on_expires_at  (expires_at)
#  index_patreon_users_on_patreon_id  (patreon_id)
#  index_patreon_users_on_user_id     (user_id) UNIQUE
#
FactoryBot.define do
  factory :patreon_user do
    sequence(:user_id) { |n| "user_#{SecureRandom.hex(8)}_#{n}" }
    sequence(:patreon_id) { |n| "patreon_#{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:name) { |n| "Patreon User #{n}" }
    has_free { true }
    has_premium { false }
    tier_name { 'Free' }
    expires_at { 1.month.from_now }
    access_token { SecureRandom.hex(32) }
    refresh_token { SecureRandom.hex(32) }
    last_authenticated_at { Time.current }

    trait :free do
      has_free { true }
      has_premium { false }
      tier_name { 'Free' }
    end

    trait :apprentice do
      has_free { true }
      has_premium { false }
      tier_name { 'Apprentice' }
    end

    trait :wizard do
      has_free { true }
      has_premium { true }
      tier_name { 'Wizard' }
    end

    trait :expired do
      expires_at { 1.day.ago }
    end

    trait :unauthenticated do
      access_token { nil }
      refresh_token { nil }
      expires_at { nil }
      last_authenticated_at { nil }
    end
  end
end
