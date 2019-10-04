# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  world       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_campaigns_on_slug     (slug) UNIQUE
#  index_campaigns_on_user_id  (user_id)
#

FactoryBot.define do
  factory :campaign do
    name { Faker::TvShows::GameOfThrones.city }
    description { Faker::Movies::HarryPotter.quote }
    world { Faker::Movies::LordOfTheRings.location }
    association :user, factory: :other_user
    factory :campaign_with_assoc do
      transient do
        adventures_count { 5 }
        player_characters_count { 5 }
        non_player_characters_count { 10 }
      end

      after(:create) do |campaign, evaluator|
        create_list(:adventure, evaluator.adventures_count, campaign: campaign)
        create_list(:player_character, evaluator.player_characters_count, campaign: campaign)
        create_list(:non_player_character, evaluator.non_player_characters_count, campaign: campaign)
      end
    end
  end
end
