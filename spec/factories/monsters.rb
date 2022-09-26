# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  attack_bonus           :integer
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  condition_immunities   :string           default([]), is an Array
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  prof_bonus             :integer          default(2)
#  save_dc                :integer          default(13)
#  size                   :string
#  slug                   :string
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
#  xp                     :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
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
    challenge = "#{hit_dice_number}"

    alignment { DndRules.alignments.sample }
    armor_class { Faker::Number.between(from: 10, to: 25) }
    attack_bonus { Faker::Number.between(from: 0, to: 17) }
    challenge_rating { challenge }
    charisma { Faker::Number.between(from: 8, to: 22) }
    constitution { Faker::Number.between(from: 8, to: 22) }
    dexterity { Faker::Number.between(from: 8, to: 22) }
    hit_dice { "#{hit_dice_number}d#{hit_dice_value}" }
    hit_points { hit_dice_value * hit_dice_number }
    intelligence { Faker::Number.between(from: 8, to: 22) }
    languages { 'Common, Goblin, Klingon' }
    monster_subtype { %w(super wtf hmm yup).sample }
    monster_type { %w(aberration dragon humanoid undead).sample }
    name { Faker::Games::ElderScrolls.creature }
    prof_bonus { Faker::Number.between(from: 3, to: 10) }
    save_dc { Faker::Number.between(from: 13, to: 22) }
    size { %w(small medium large gigantic) }
    strength { Faker::Number.between(from: 8, to: 22) }
    wisdom { Faker::Number.between(from: 8, to: 22) }
    xp { CrCalc.xp_for_cr(challenge) }

    #Associations

    after(:create) do |monster|
      create_list(:action, rand(1..3), monster: monster)
      create_list(:legendary_action, rand(1..3), monster: monster)
      create_list(:reaction, rand(1..3), monster: monster)
      create_list(:special_ability, rand(1..3), monster: monster)
      create_list(:damage_immunity, rand(1..3), monster: monster)
      create_list(:damage_resistance, rand(1..3), monster: monster)
      create_list(:damage_vulnerability, rand(1..3), monster: monster)
    end

    factory :monster_dragon do

    end
  end
end
