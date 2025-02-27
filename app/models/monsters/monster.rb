# frozen_string_literal: true

# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  attack_bonus           :integer
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  condition_immunities   :string           default([]), is an Array
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  prof_bonus             :integer          default(2)
#  save_dc                :integer          default(13)
#  size                   :string
#  slug                   :string
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
#  xp                     :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Monster < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  has_many :actions, dependent: :destroy
  has_many :monster_actions, dependent: :destroy
  has_many :legendary_actions, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_many :special_abilities, dependent: :destroy

  has_many :senses, dependent: :destroy
  has_many :speeds, dependent: :destroy

  has_many :monster_proficiencies
  has_many :profs, -> { distinct }, through: :monster_proficiencies

  belongs_to :user, optional: true

  accepts_nested_attributes_for :monster_actions, allow_destroy: true
  accepts_nested_attributes_for :legendary_actions, allow_destroy: true
  accepts_nested_attributes_for :reactions, allow_destroy: true
  accepts_nested_attributes_for :special_abilities, allow_destroy: true
  accepts_nested_attributes_for :senses, allow_destroy: true
  accepts_nested_attributes_for :speeds, allow_destroy: true
  accepts_nested_attributes_for :monster_proficiencies, allow_destroy: true

  def saving_throws
    saves = []
    monster_proficiencies.each do |monster_prof|
      conditional = ''
      if monster_prof.prof.prof_type == 'Saving Throws'
        conditional = '+' if monster_prof.value > 0
        conditional = '-' if monster_prof.value < 0
        conditional = '' if monster_prof.value == 0
        st_name = monster_prof.prof.name
        st_name.slice!('Saving Throw: ')
        saves << "#{st_name.titleize} #{conditional}#{monster_prof.value}"
      end
    end
    saves
  end

  def num_saving_throws
    saves = 0
    monster_proficiencies.each do |monster_prof|
      if monster_prof.prof.prof_type == 'Saving Throws'
        saves += 1
      end
    end
    saves
  end

  def skills
    skills = []
    monster_proficiencies.each do |monster_prof|
      conditional = ''
      if monster_prof.prof.prof_type == 'Skills'
        conditional = '+' if monster_prof.value > 0
        conditional = '-' if monster_prof.value < 0
        conditional = '' if monster_prof.value == 0
        st_name = monster_prof.prof.name
        st_name.slice!('Skill: ')
        skills << "#{st_name.titleize} #{conditional}#{monster_prof.value}"
      end
    end
    skills
  end

  def has_perception
    has_perception = false
    monster_proficiencies.each do |monster_prof|
      if monster_prof.prof.prof_type == 'Skills'
        st_name = monster_prof.prof.name
        st_name.slice!('Skill: ')
        if st_name.downcase == 'perception'
          has_perception = true
          break
        end
      end
    end
    has_perception
  end

  def senses_array
    sense_return = []
    senses.each do |sense|
      if sense.name.downcase == 'passive perception'
        sense_return << "passive Perception #{sense.value}"
      else
        sense_return << "#{sense.name} #{sense.value}"
      end
    end
    sense_return
  end

  def speeds_array
    speed_return = []
    speeds.each do |speed|
      if speed.name.downcase == 'walk'
        speed_return << "#{speed.value} ft."
      elsif speed.name.downcase == 'hover'
        speed_return << 'Hover'
      else
        speed_return << "#{speed.name} #{speed.value} ft."
      end
    end
    speed_return.sort
  end

  def hit_dice_string
    con_mod = DndRules.ability_score_modifier(constitution)
    num_hit_die = hit_dice.scan(/\d+/).first.to_i
    if con_mod > 0
      "(#{hit_dice} + #{con_mod * num_hit_die})"
    elsif con_mod < 0
      "(#{hit_dice} - #{con_mod.abs * num_hit_die})"
    else
      "(#{hit_dice})"
    end
  end

  def hit_points_string
    "#{hit_points} #{hit_dice_string}"
  end

  def challenge_string
    "#{challenge_rating} (#{xp.to_s(:delimited)} XP)"
  end

  def is_caster
    is_caster_result = false
    special_abilities.each do |ability|
      is_caster_result = true if ability.name.downcase == 'spellcasting'
    end
    is_caster_result
  end

  def monster_atts
    monster_atts = attributes
    monster_atts[:actions] = monster_actions.map { |action| action.attributes }
    monster_atts[:special_abilities] = special_abilities.map { |action| action.attributes }
    monster_atts[:reactions] = reactions.map { |action| action.attributes }
    monster_atts[:legendary_actions] = legendary_actions.map { |action| action.attributes }
    monster_atts
  end

  def damage_per_round
    damages = []
    num_attacks = 1
    num_attack_types = 0
    monster_actions.each do |action|
      damage_dice = action.desc[/([1-9]\d*)?d([1-9]\d*)/m]
      npc_dam_bonus = DndRules.ability_score_modifier(strength)
      _, base_damage = NpcGenerator.action_damage(damage_dice, npc_dam_bonus, action.desc)
      if action.name.downcase == 'multiattack'
        num_attacks_array = action.desc.scan(/\d+/).map(&:to_i)
        num_attacks = num_attacks_array.sum
      elsif base_damage > 0
        num_attack_types += 1
        damages << base_damage
      end
    end
    num_attack_types = 1 if num_attack_types == 0
    damages = [1] if damages.empty?
    damages.sum.to_f * num_attacks / num_attack_types
  end

  def offensive_cr
    CrCalc.get_offensive_cr(self, self.damage_per_round, self.attack_bonus)
  end

  def defensive_cr
    CrCalc.get_defensive_cr(self, self.challenge_rating, self.armor_class, self.hit_points)
  end

  include PgSearch::Model

  # PgSearch
  multisearchable against: [:name, :monster_type, :challenge_rating, :alignment]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    monster_type: 'B',
                    challenge_rating: 'C',
                    alignment: 'D'
                  },
                  associated_against: {
                    user: [:name, :id],
                    monster_actions: [:name]
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  def xml_element(name, type, value, xml)
    xml.send(name) do
      xml.parent.set_attribute('type', type)
      xml.text value
    end
  end

  def export
    monster_export = Nokogiri::XML::Builder.new do |xml|
      xml.root do
        xml.npc do
          xml.abilities do
            xml.charisma do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.charisma), xml)
              self.xml_element('score', 'number', self.charisma, xml)
            end
            xml.constitution do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.constitution), xml)
              self.xml_element('score', 'number', self.constitution, xml)
            end
            xml.dexterity do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.dexterity), xml)
              self.xml_element('score', 'number', self.dexterity, xml)
            end
            xml.intelligence do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.intelligence), xml)
              self.xml_element('score', 'number', self.intelligence, xml)
            end
            xml.strength do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.strength), xml)
              self.xml_element('score', 'number', self.strength, xml)
            end
            xml.wisdom do
              self.xml_element('bonus', 'number', DndRules.ability_score_modifier(self.wisdom), xml)
              self.xml_element('score', 'number', self.wisdom, xml)
            end
          end
          self.xml_element('ac', 'number', self.armor_class, xml)
          self.xml_element('actext', 'string', '', xml)
          xml.actions do
            self.monster_actions.each_with_index do |action, index|
              action_id = sprintf '%05d', index + 1
              xml.send "widgetId-#{action_id}" do
                self.xml_element('desc', 'string', action.desc, xml)
                self.xml_element('name', 'string', action.name, xml)
              end
            end
          end
          self.xml_element('alignment', 'string', self.alignment, xml)
          self.xml_element('conditionimmunities', 'string', self.condition_immunities.join(', '), xml)
          self.xml_element('cr', 'string', self.challenge_rating, xml)
          self.xml_element('damageimmunities', 'string', self.damage_immunities.join(', '), xml)
          self.xml_element('damageresistances', 'string', self.damage_resistances.join(', '), xml)
          self.xml_element('hd', 'string', self.hit_dice_string, xml)
          self.xml_element('hp', 'number', self.hit_points, xml)
          self.xml_element('languages', 'string', self.languages, xml)
          xml.legendaryactions do
            self.legendary_actions.each_with_index do |action, index|
              action_id = sprintf '%05d', index + 1
              xml.send "widgetId-#{action_id}" do
                self.xml_element('desc', 'string', action.desc, xml)
                self.xml_element('name', 'string', action.name, xml)
              end
            end
          end
          self.xml_element('locked', 'number', 1, xml)
          self.xml_element('name', 'string', self.name, xml)
          xml.reactions do
            self.reactions.each_with_index do |action, index|
              action_id = sprintf '%05d', index + 1
              xml.send "widgetId-#{action_id}" do
                self.xml_element('desc', 'string', action.desc, xml)
                self.xml_element('name', 'string', action.name, xml)
              end
            end
          end
          self.xml_element('savingthrows', 'string', self.saving_throws.join(', '), xml)
          self.xml_element('senses', 'string', self.senses_array.join(', '), xml)
          self.xml_element('size', 'string', self.size, xml)
          self.xml_element('skills', 'string', self.skills.join(', '), xml)
          self.xml_element('speed', 'string', self.speeds_array.join(', '), xml)
          xml.traits do
            self.special_abilities.each_with_index do |action, index|
              action_id = sprintf '%05d', index + 1
              xml.send "widgetId-#{action_id}" do
                self.xml_element('desc', 'string', action.desc, xml)
                self.xml_element('name', 'string', action.name, xml)
              end
            end
          end
          self.xml_element('type', 'string', self.monster_type, xml)
          self.xml_element('xp', 'number', self.xp, xml)
        end
      end
    end
    monster_export.to_xml
  end
end
