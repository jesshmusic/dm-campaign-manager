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

require 'rails_helper'

RSpec.describe StatBlock, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
