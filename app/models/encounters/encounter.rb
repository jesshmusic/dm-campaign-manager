# frozen_string_literal: true

# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer          default(0)
#  description     :text
#  electrum_pieces :integer          default(0)
#  gold_pieces     :integer          default(0)
#  location        :string           default("New Location"), not null
#  name            :string           default("New Encounter")
#  platinum_pieces :integer          default(0)
#  silver_pieces   :integer          default(0)
#  sort            :integer          default(0), not null
#  xp              :integer          default(0)
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

  belongs_to :adventure

  has_many :encounter_monsters, inverse_of: :encounter
  has_many :encounter_items, dependent: :destroy

  accepts_nested_attributes_for :encounter_monsters, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :encounter_items, reject_if: :all_blank, allow_destroy: true

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

  def next_encounter_id
    encounters = adventure.encounters.order(sort: :asc)
    next_encounter = encounters.find_by(sort: sort + 1)
    if next_encounter.present?
      next_encounter.id
    else
      encounters.find_by(sort: 0)&.id
    end
  end

  def prev_encounter_id
    encounters = adventure.encounters.order(sort: :asc)
    next_encounter = encounters.find_by(sort: sort - 1)
    if next_encounter.present?
      next_encounter.id
    else
      encounters.find_by(sort: encounters.count - 1)&.id
    end
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    location: 'B',
                    description: 'C'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
