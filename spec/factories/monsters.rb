# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  actions                :jsonb            is an Array
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  legendary_actions      :jsonb            is an Array
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  reactions              :jsonb            is an Array
#  senses                 :jsonb
#  size                   :string
#  slug                   :string
#  special_abilities      :jsonb            is an Array
#  speed                  :jsonb
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
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
    name { Faker::Games::ElderScrolls.creature }
    size { %w(small medium large gigantic) }
    monster_type { %w(aberration dragon humanoid undead).sample }
    alignment { DndRules.alignments.sample }
    armor_class { Faker::Number.between(from: 10, to: 25) }
    hit_points { hit_dice_value * hit_dice_number }
    hit_dice_number { hit_dice_number }
    hit_dice_value { hit_dice_value }
    speed { "30 feet" }
    strength { Faker::Number.between(from: 8, to: 22) }
    dexterity { Faker::Number.between(from: 8, to: 22) }
    constitution { Faker::Number.between(from: 8, to: 22) }
    intelligence { Faker::Number.between(from: 8, to: 22) }
    wisdom { Faker::Number.between(from: 8, to: 22) }
    charisma { Faker::Number.between(from: 8, to: 22) }
    challenge_rating { "#{hit_dice_number}" }

    factory :monster_dragon do

    end
  end
end
