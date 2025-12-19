# frozen_string_literal: true

# == Schema Information
#
# Table name: backgrounds
#
#  id                  :bigint           not null, primary key
#  ability_scores      :string           default([]), is an Array
#  description         :text
#  edition             :string           default("2024"), not null
#  equipment_option_a  :text
#  equipment_option_b  :text
#  feat_name           :string
#  homebrew            :boolean          default(FALSE), not null
#  name                :string           not null
#  skill_proficiencies :string           default([]), is an Array
#  slug                :string           not null
#  tool_proficiency    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_backgrounds_on_edition           (edition)
#  index_backgrounds_on_homebrew          (homebrew)
#  index_backgrounds_on_slug_and_edition  (slug,edition) UNIQUE
#  index_backgrounds_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :background do
    sequence(:name) { |n| "Background #{n}" }
    edition { '2024' }
    ability_scores { %w[Intelligence Wisdom Charisma] }
    feat_name { 'Magic Initiate (Cleric)' }
    skill_proficiencies { %w[Insight Religion] }
    tool_proficiency { "Calligrapher's Supplies" }
    equipment_option_a { "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP" }
    equipment_option_b { '50 GP' }
    description { 'A sample background description' }
    homebrew { false }
    user { nil }

    trait :homebrew do
      homebrew { true }
      association :user
    end

    trait :acolyte do
      name { 'Acolyte' }
      ability_scores { %w[Intelligence Wisdom Charisma] }
      feat_name { 'Magic Initiate (Cleric)' }
      skill_proficiencies { %w[Insight Religion] }
      tool_proficiency { "Calligrapher's Supplies" }
    end

    trait :criminal do
      name { 'Criminal' }
      ability_scores { %w[Dexterity Constitution Intelligence] }
      feat_name { 'Alert' }
      skill_proficiencies { ['Sleight of Hand', 'Stealth'] }
      tool_proficiency { "Thieves' Tools" }
    end
  end
end
