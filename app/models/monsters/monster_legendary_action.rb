# frozen_string_literal: true

# == Schema Information
#
# Table name: monster_legendary_actions
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
#  index_monster_legendary_actions_on_monster_id  (monster_id)
#

class MonsterLegendaryAction < ApplicationRecord
  validates :name, presence: true

  has_many :action_damages, dependent: :destroy
  belongs_to :monster
end
