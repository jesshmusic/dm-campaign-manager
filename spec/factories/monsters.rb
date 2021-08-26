# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer          default(10), not null
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer          default(10), not null
#  dexterity_save         :integer
#  hit_dice_modifier      :integer          default(0)
#  hit_dice_number        :integer          default(1), not null
#  hit_dice_value         :integer          default(8), not null
#  hit_points             :integer          default(8), not null
#  initiative             :integer          default(0), not null
#  intelligence           :integer          default(10), not null
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  senses                 :string
#  size                   :string
#  slug                   :string
#  speed                  :string           default("30 feet"), not null
#  strength               :integer          default(10), not null
#  strength_save          :integer
#  wisdom                 :integer          default(10), not null
#  wisdom_save            :integer
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
