# == Schema Information
#
# Table name: monster_special_abilities
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
#  index_monster_special_abilities_on_monster_id  (monster_id)
#

class MonsterSpecialAbility < ApplicationRecord
  validates :name, presence: true

  belongs_to :monster
end
