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
        guilds_count { 2 }
        adventures_count { 5 }
        player_characters_count { 5 }
        non_player_characters_count { 10 }
      end

      after(:create) do |campaign, evaluator|
        create_list(:guild, evaluator.guilds_count, campaign: campaign)
        create_list(:player_character,
                    evaluator.player_characters_count,
                    campaign: campaign)
        create_list(:non_player_character,
                    evaluator.non_player_characters_count,
                    campaign: campaign,
                    guild: campaign.guilds.sample)
        create_list(:adventure,
                    evaluator.adventures_count,
                    campaign: campaign,
                    character_ids: campaign.pcs.map(&:id))
      end
    end

    factory :campaign_with_full_adventure do
      transient do
        guilds_count { 2 }
        adventures_count { 1 }
        player_characters_count { 5 }
        non_player_characters_count { 10 }
      end

      after(:create) do |campaign, evaluator|
        create_list(:guild, evaluator.guilds_count, campaign: campaign)
        puts campaign.guilds.to_json
        create_list(:player_character,
                    evaluator.player_characters_count,
                    campaign: campaign)
        create_list(:non_player_character,
                    evaluator.non_player_characters_count,
                    campaign: campaign,
                    guild: campaign.guilds.sample)
        create_list(:adventure_full, evaluator.adventures_count,
                    campaign: campaign,
                    character_ids: campaign.pcs.map(&:id))
      end
    end

    factory :campaign_many_chars do
      transient do
        guilds_count { 2 }
        adventures_count { 5 }
        player_characters_count { 5 }
        non_player_characters_count { 100 }
      end

      after(:create) do |campaign, evaluator|
        create_list(:guild, evaluator.guilds_count, campaign: campaign)
        create_list(:adventure, evaluator.adventures_count, campaign: campaign)
        create_list(:player_character,
                    evaluator.player_characters_count,
                    campaign: campaign)
        create_list(:non_player_character,
                    evaluator.non_player_characters_count,
                    campaign: campaign,
                    guild: campaign.guilds.sample)
      end
    end
  end
end
