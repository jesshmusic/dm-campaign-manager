# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id                   :bigint           not null, primary key
#  alignment            :string           default("neutral")
#  armor_class          :integer          default(10), not null
#  armor_class_modifier :integer          default(0), not null
#  background           :string           default("Acolyte")
#  charisma             :integer          default(10), not null
#  constitution         :integer          default(10), not null
#  copper_pieces        :integer          default(0)
#  description          :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity            :integer          default(10), not null
#  electrum_pieces      :integer          default(0)
#  gold_pieces          :integer          default(0)
#  hit_points           :integer          default(8), not null
#  hit_points_current   :integer          default(8), not null
#  initiative           :integer          default(0), not null
#  intelligence         :integer          default(10), not null
#  languages            :string           default("Common")
#  name                 :string           not null
#  platinum_pieces      :integer          default(0)
#  proficiency          :integer          default(2)
#  role                 :string           default("Player Character")
#  silver_pieces        :integer          default(0), not null
#  slug                 :string           not null
#  speed                :string           default("30 feet"), not null
#  strength             :integer          default(10), not null
#  type                 :string
#  wisdom               :integer          default(10), not null
#  xp                   :integer          default(0), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  armor_id             :integer
#  campaign_id          :bigint
#  race_id              :integer          default(1), not null
#  shield_id            :integer
#  weapon_2h_id         :integer
#  weapon_lh_id         :integer
#  weapon_rh_id         :integer
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

class Character < ApplicationRecord
  validates :name, :hit_points, :alignment, :charisma, :constitution, :dexterity, :intelligence,
            :strength, :type, :wisdom, presence: true
  validates :character_classes, length: {minimum: 1}

  after_validation(on: :create) do
    self.slug = generate_slug
  end

  before_save do
    self.hit_points_current = hit_points
    self.initiative = DndRules.ability_score_modifier(dexterity)
    self.proficiency = DndRules.proficiency_bonus_for_level(total_level)
    character_classes.each do |character_class|
      character_class.proficiency_bonus = proficiency
      character_class.setup_spell_scores(self)
    end
    character_spells.each do |character_spell|
      dnd_class_first = dnd_classes.first.name
      character_spell.spell_class = dnd_class_first if character_spell.spell_class.nil?
      character_spell.save!
    end
    has_shield = shield_id && !weapon_2h_id
    self.armor_class = calculate_armor_class(has_shield)
    character_actions.delete_all
    create_attack_action(weapon_rh) if weapon_rh_id && !weapon_2h_id
    create_attack_action(weapon_lh, true) if weapon_lh_id && !has_shield
    create_attack_action(weapon_2h) if weapon_2h_id
    self.xp = DndRules.xp_for_cr(challenge_rating) if type == 'NonPlayerCharacter'
  end

  attribute :min_score, :integer

  has_many :character_actions, dependent: :destroy

  has_many :character_items, dependent: :destroy

  has_many :skills, dependent: :destroy

  has_many :character_classes, dependent: :destroy
  has_many :dnd_classes, through: :character_classes

  has_many :character_spells, dependent: :destroy
  has_many :spells, through: :character_spells

  has_many :character_adventures, dependent: :destroy
  has_many :adventures, through: :character_adventures

  accepts_nested_attributes_for :character_items, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :character_classes, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :character_spells, reject_if: :all_blank, allow_destroy: true

  belongs_to :campaign

  def armor
    ArmorItem.find(armor_id) unless armor_id.nil?
  end

  def campaigns_string
    campaign.name
  end

  def classes
    character_classes.map(&:class_and_level).join(', ')
  end

  def hit_dice
    hit_dice_array = []
    character_classes.each do |character_class|
      hit_dice_array << "#{character_class.dnd_class.name}: #{character_class.level}d#{character_class.dnd_class.hit_die}"
    end
    hit_dice_array.join(', ')
  end

  def race
    Race.find(race_id)
  end

  def shield
    ArmorItem.find(shield_id) unless shield_id.nil?
  end

  def total_level
    character_classes.sum(&:level)
  end

  def weapon_lh
    WeaponItem.find(weapon_lh_id) unless weapon_lh_id.nil?
  end

  def weapon_rh
    WeaponItem.find(weapon_rh_id) unless weapon_rh_id.nil?
  end

  def weapon_2h
    WeaponItem.find(weapon_2h_id) unless weapon_2h_id.nil?
  end

  def armors
    character_items.includes(:item).where(items: {type: 'ArmorItem'})
  end

  def one_handed_weapons
    weapons = character_items.includes(:item).where(items: {type: 'WeaponItem'})
    weapons.where.not("'Two-Handed' = ANY (weapon_properties)")
  end

  def two_handed_weapons
    weapons = character_items.includes(:item).where(items: {type: 'WeaponItem'})
    weapons.where("'Two-Handed' = ANY (weapon_properties)")
  end

  def cantrips
    character_spells.includes(:spell).where(spells: {level: 0})
  end

  def spells_level_1
    character_spells.includes(:spell).where(spells: {level: 1})
  end

  def spells_level_2
    character_spells.includes(:spell).where(spells: {level: 2})
  end

  def spells_level_3
    character_spells.includes(:spell).where(spells: {level: 3})
  end

  def spells_level_4
    character_spells.includes(:spell).where(spells: {level: 4})
  end

  def spells_level_5
    character_spells.includes(:spell).where(spells: {level: 5})
  end

  def spells_level_6
    character_spells.includes(:spell).where(spells: {level: 6})
  end

  def spells_level_7
    character_spells.includes(:spell).where(spells: {level: 7})
  end

  def spells_level_8
    character_spells.includes(:spell).where(spells: {level: 8})
  end

  def spells_level_9
    character_spells.includes(:spell).where(spells: {level: 9})
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {name: 'A', description: 'B'},
                  using: {tsearch: {prefix: true}}

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = Character.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize
  end

  def calculate_armor_class(has_shield)
    if armor_id && has_shield
      if armor.armor_dex_bonus
        armor.armor_class + armor.armor_class_bonus + DndRules.ability_score_modifier(dexterity) + shield.armor_class_bonus
      else
        armor.armor_class + armor.armor_class_bonus + shield.armor_class_bonus
      end
    elsif armor_id
      if armor.armor_dex_bonus
        armor.armor_class + armor.armor_class_bonus + DndRules.ability_score_modifier(dexterity)
      else
        armor.armor_class + armor.armor_class_bonus
      end
    elsif has_shield
      10 + DndRules.ability_score_modifier(dexterity) + shield.armor_class_bonus
    else
      10 + DndRules.ability_score_modifier(dexterity)
    end
  end

  def create_attack_action(weapon, is_offhand = false)
    attack_action = CharacterAction.create(
      name: weapon.name,
      description: weapon.description
    )
    if weapon.weapon_range.include? 'Ranged'
      attack_action.attack_bonus = DndRules.ability_score_modifier(dexterity) + proficiency + weapon.weapon_attack_bonus
      attack_action.damage_bonus = DndRules.ability_score_modifier(dexterity) + weapon.weapon_damage_bonus
    elsif is_offhand
      attack_action.attack_bonus = DndRules.ability_score_modifier(strength) + proficiency + weapon.weapon_attack_bonus
      attack_action.damage_bonus = weapon.weapon_damage_bonus
    else
      attack_action.attack_bonus = DndRules.ability_score_modifier(strength) + proficiency + weapon.weapon_attack_bonus
      attack_action.damage_bonus = DndRules.ability_score_modifier(strength) + weapon.weapon_damage_bonus
    end
    if weapon.weapon_2h_damage_type
      weapon_2h_damage = "2h: #{weapon.weapon_2h_damage_dice_count}d#{weapon.weapon_2h_damage_dice_value} #{weapon.weapon_2h_damage_type}"
      weapon_1h_damage = "1h: #{weapon.weapon_damage_dice_count}d#{weapon.weapon_damage_dice_value} #{weapon.weapon_damage_type}"
      weapon_2h_damage += " + #{attack_action.damage_bonus}" if attack_action.damage_bonus&.positive?
      weapon_1h_damage += " + #{attack_action.damage_bonus}" if attack_action.damage_bonus&.positive?
      weapon_2h_damage += " - #{attack_action.damage_bonus}" if attack_action.damage_bonus&.negative?
      weapon_1h_damage += " - #{attack_action.damage_bonus}" if attack_action.damage_bonus&.negative?
      attack_action.damage_dice = "#{weapon_1h_damage}, #{weapon_2h_damage}"
    else
      weapon_damage = "#{weapon.weapon_damage_dice_count}d#{weapon.weapon_damage_dice_value} #{weapon.weapon_damage_type}"
      weapon_damage += " + #{attack_action.damage_bonus}" if attack_action.damage_bonus&.positive?
      weapon_damage += " - #{attack_action.damage_bonus}" if attack_action.damage_bonus&.negative?
      attack_action.damage_dice = "#{weapon_damage}"
    end
    character_actions << attack_action
  end
end
