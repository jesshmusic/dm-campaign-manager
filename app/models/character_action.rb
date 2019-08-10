# frozen_string_literal: true

# == Schema Information
#
# Table name: character_actions
#
#  id           :bigint           not null, primary key
#  attack_bonus :integer
#  damage_bonus :integer
#  damage_dice  :string
#  description  :text             default("")
#  name         :string           default("New Action")
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#
# Indexes
#
#  index_character_actions_on_character_id  (character_id)
#

class CharacterAction < ApplicationRecord
  validates :name, presence: true

  belongs_to :character
end
