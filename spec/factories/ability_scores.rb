# == Schema Information
#
# Table name: ability_scores
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  full_name  :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_ability_scores_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :ability_score do
    name { "MyString" }
    full_name { "MyString" }
    desc { "MyString" }
    slug { "MyString" }

    factory :str_ability_score do
      name { "STR" }
      full_name { "Strength" }
      desc { "A long winded description" }
      slug { "str" }
    end

    factory :dex_ability_score do
      name { "DEX" }
      full_name { "Dexterity" }
      desc { "A long winded description" }
      slug { "dex" }
    end

    factory :con_ability_score do
      name { "CON" }
      full_name { "Constitution" }
      desc { "A long winded description" }
      slug { "con" }
    end

    factory :int_ability_score do
      name { "INT" }
      full_name { "Intelligence" }
      desc { "A long winded description" }
      slug { "int" }
    end

    factory :wis_ability_score do
      name { "WIS" }
      full_name { "Wisdom" }
      desc { "A long winded description" }
      slug { "wis" }
    end

    factory :cha_ability_score do
      name { "CHA" }
      full_name { "Charisma" }
      desc { "A long winded description" }
      slug { "cha" }
    end
  end
end
