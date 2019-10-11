# frozen_string_literal: true

# == Schema Information
#
# Table name: encounters
#
#  id                :bigint           not null, primary key
#  copper_pieces     :integer          default(0)
#  current_mob_index :integer          default(0)
#  description       :text
#  electrum_pieces   :integer          default(0)
#  gold_pieces       :integer          default(0)
#  in_progress       :boolean          default(FALSE)
#  location          :string           default("New Location"), not null
#  name              :string           default("New Encounter")
#  platinum_pieces   :integer          default(0)
#  round             :integer          default(1)
#  silver_pieces     :integer          default(0)
#  sort              :integer          default(0), not null
#  xp                :integer          default(0)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  adventure_id      :bigint
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
  before_create :set_sort_order
  before_save :pre_setup_encounter
  after_create :setup_encounter

  belongs_to :adventure
  has_many :encounter_combatants, dependent: :destroy

  has_many :encounter_items, dependent: :destroy
  has_many :encounter_monsters, dependent: :destroy
  has_many :encounter_npcs, dependent: :destroy
  has_many :characters, through: :encounter_npcs

  accepts_nested_attributes_for :encounter_combatants
  accepts_nested_attributes_for :encounter_items, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :encounter_monsters, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :encounter_npcs, reject_if: :all_blank, allow_destroy: true

  def total_monsters
    sum_of_monsters = 0
    encounter_monsters.each do |encounter_monster|
      sum_of_monsters += encounter_monster.number_of_monsters
    end
    sum_of_monsters
  end

  def set_sort_order
    self.sort = adventure.encounters.count - 1
  end

  def pre_setup_encounter
    self.xp = 0
    encounter_monsters.each do |encounter_monster|
      (1..encounter_monster.number_of_monsters).each do
        self.xp += encounter_monster.monster.xp
      end
    end

    encounter_npcs.each do |npc|
      self.xp += npc.character.xp if npc.is_combatant
    end
  end

  def update_encounter
    encounter_combatants.destroy_all
    self.in_progress = false
    self.round = 1
    self.current_mob_index = 0
    setup_encounter
  end

  def setup_encounter
    combat_order_num = 0
    encounter_monsters.each do |encounter_monster|
      (1..encounter_monster.number_of_monsters).each do |value|
        encounter_combatants << EncounterCombatant.create(
          name: "#{encounter_monster.monster.name} #{value}",
          combat_order_number: combat_order_num,
          current_hit_points: encounter_monster.monster.hit_points,
          monster: encounter_monster.monster
        )
        combat_order_num += 1
      end
    end
    encounter_npcs.each do |npc|
      next unless npc.is_combatant

      encounter_combatants << EncounterCombatant.create(
        name: npc.character.name,
        combat_order_number: combat_order_num,
        current_hit_points: npc.character.hit_points,
        character: npc.character
      )
      combat_order_num += 1
    end
    adventure.pcs.each do |pc|
      encounter_combatants << EncounterCombatant.create(
        name: pc.name,
        combat_order_number: combat_order_num,
        current_hit_points: pc.hit_points,
        character: pc
      )
      combat_order_num += 1
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
    prev_encounter = encounters.find_by(sort: sort - 1)
    if prev_encounter.present?
      prev_encounter.id
    else
      encounters.find_by(sort: encounters.count - 1)&.id
    end
  end

  def npcs
    encounter_npcs.map(&:character)
  end

  def npc_options
    adventure.npcs
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
