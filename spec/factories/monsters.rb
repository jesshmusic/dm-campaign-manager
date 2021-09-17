# == Schema Information
#
# Table name: monsters
#
#  id                    :bigint           not null, primary key
#  alignment             :string
#  api_url               :string
#  armor_class           :integer          default(10)
#  challenge_rating      :string
#  charisma              :integer          default(10), not null
#  constitution          :integer          default(10), not null
#  dexterity             :integer          default(10), not null
#  hit_dice              :string
#  hit_points            :integer          default(8), not null
#  intelligence          :integer          default(10), not null
#  languages             :string
#  legendary_description :text
#  monster_subtype       :string
#  monster_type          :string
#  name                  :string
#  size                  :string
#  slug                  :string
#  strength              :integer          default(10), not null
#  wisdom                :integer          default(10), not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  user_id               :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :monster do
    hit_dice_number = Faker::Number.between(from: 1, to: 20)
    hit_dice_value = [8, 10, 12].sample

    alignment { DndRules.alignments.sample }
    armor_class { Faker::Number.between(from: 10, to: 25) }
    challenge_rating { "#{hit_dice_number}" }
    charisma { Faker::Number.between(from: 8, to: 22) }
    constitution { Faker::Number.between(from: 8, to: 22) }
    damage_immunities { %w(unconscious charmed poison) }
    damage_resistances { %w(fire piercing) }
    damage_vulnerabilities { %w(slashing acid) }
    dexterity { Faker::Number.between(from: 8, to: 22) }
    hit_dice { "#{hit_dice_number}d#{hit_dice_value}" }
    hit_points { hit_dice_value * hit_dice_number }
    intelligence { Faker::Number.between(from: 8, to: 22) }
    languages { 'Common, Goblin, Klingon' }
    monster_subtype { %w(super wtf hmm yup).sample }
    monster_type { %w(aberration dragon humanoid undead).sample }
    name { Faker::Games::ElderScrolls.creature }
    size { %w(small medium large gigantic) }
    strength { Faker::Number.between(from: 8, to: 22) }
    wisdom { Faker::Number.between(from: 8, to: 22) }

    #Associations

    after(:create) do |monster|
      create_list(:action, rand(1..3), monster: monster)
      create_list(:legendary_action, rand(1..3), monster: monster)
      create_list(:reaction, rand(1..3), monster: monster)
      create_list(:special_ability, rand(1..3), monster: monster)
    end

    factory :monster_dragon do

    end
  end
end
