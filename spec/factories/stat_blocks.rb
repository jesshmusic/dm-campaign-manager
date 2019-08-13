# == Schema Information
#
# Table name: stat_blocks
#
#  id                 :bigint           not null, primary key
#  armor_class        :integer          default(10)
#  charisma           :integer          default(10), not null
#  constitution       :integer          default(10), not null
#  dexterity          :integer          default(10), not null
#  hit_dice_modifier  :integer          default(0)
#  hit_dice_number    :integer          default(1), not null
#  hit_dice_value     :integer          default(8), not null
#  hit_points         :integer          default(8), not null
#  hit_points_current :integer          default(8), not null
#  initiative         :integer          default(0), not null
#  intelligence       :integer          default(10), not null
#  proficiency        :integer          default(2), not null
#  speed              :string           default("30 feet"), not null
#  strength           :integer          default(10), not null
#  wisdom             :integer          default(10), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  character_id       :bigint
#  monster_id         :bigint
#
# Indexes
#
#  index_stat_blocks_on_character_id  (character_id)
#  index_stat_blocks_on_monster_id    (monster_id)
#

FactoryBot.define do
  factory :stat_block do
    character { "" }
    monster { "" }
    armor_class { 1 }
    charisma { 1 }
    constitution { 1 }
    dexterity { 1 }
    hit_dice_number { 1 }
    hit_dice_value { 1 }
    hit_points { 1 }
    intelligence { 1 }
    speed { "MyString" }
    strength { 1 }
    wisdom { 1 }
  end
end
