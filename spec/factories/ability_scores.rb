# == Schema Information
#
# Table name: ability_scores
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  edition    :string           default("2014"), not null
#  full_name  :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_ability_scores_on_edition  (edition)
#  index_ability_scores_on_slug     (slug) UNIQUE
#
FactoryBot.define do
  factory :ability_score do
    sequence(:name) { |n| "AbilityScore#{n}" }
    sequence(:full_name) { |n| "Ability Score #{n}" }
    desc { "A long winded description" }
    sequence(:slug) { |n| "ability-score-#{n}" }

    # The specific ability score factories below use find_or_initialize_by intentionally.
    # Ability scores are reference data with fixed slugs (str, dex, con, etc.) that may
    # be seeded in the test database. This pattern prevents duplicate key errors while
    # ensuring tests can reliably access these canonical records.
    factory :str_ability_score do
      name { "STR" }
      full_name { "Strength" }
      desc { "A long winded description" }
      slug { "str" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end

    factory :dex_ability_score do
      name { "DEX" }
      full_name { "Dexterity" }
      desc { "A long winded description" }
      slug { "dex" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end

    factory :con_ability_score do
      name { "CON" }
      full_name { "Constitution" }
      desc { "A long winded description" }
      slug { "con" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end

    factory :int_ability_score do
      name { "INT" }
      full_name { "Intelligence" }
      desc { "A long winded description" }
      slug { "int" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end

    factory :wis_ability_score do
      name { "WIS" }
      full_name { "Wisdom" }
      desc { "A long winded description" }
      slug { "wis" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end

    factory :cha_ability_score do
      name { "CHA" }
      full_name { "Charisma" }
      desc { "A long winded description" }
      slug { "cha" }

      initialize_with { AbilityScore.find_or_initialize_by(slug: slug) }
    end
  end
end
