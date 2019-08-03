# == Schema Information
#
# Table name: monster_actions
#
#  id           :bigint           not null, primary key
#  attack_bonus :integer
#  damage_bonus :integer
#  damage_dice  :string
#  description  :text
#  name         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  monster_id   :bigint
#
# Indexes
#
#  index_monster_actions_on_monster_id  (monster_id)
#

require 'rails_helper'

RSpec.describe MonsterAction, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
