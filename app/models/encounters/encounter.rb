# frozen_string_literal: true

# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  electrum_pieces :integer
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  xp              :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  adventure_id    :bigint
#
# Indexes
#
#  index_encounters_on_adventure_id  (adventure_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#

class Encounter < ApplicationRecord
  before_save :calculate_xp
  has_many :encounter_monsters, inverse_of: :encounter
  has_many :equipment_items, inverse_of: :encounter

  accepts_nested_attributes_for :encounter_monsters, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :equipment_items, reject_if: :all_blank, allow_destroy: true

  def total_monsters
    sum_of_monsters = 0
    encounter_monsters.each do |encounter_monster|
      sum_of_monsters += encounter_monster.number_of_monsters
    end
    sum_of_monsters
  end

  def calculate_xp
    self.xp = 0
    encounter_monsters.each do |encounter_monster|
      (1..encounter_monster.number_of_monsters).each do
        self.xp += DndRules.xp_for_cr encounter_monster.monster.challenge_rating
      end
    end
  end
end
