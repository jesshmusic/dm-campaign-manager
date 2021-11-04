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
  validates :name, :alignment, :challenge_rating, :monster_type, :slug, presence: true

  before_validation do
    self.slug = generate_slug if will_save_change_to_name?
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

  def condition_immunities_array
    condition_immunities.map { |cond| cond.name.downcase }
  end

  def immunities
    damage_immunities.map { |damage| damage.name }
  end

  def resistances
    damage_resistances.map { |damage| damage.name }
  end

  def vulnerabilities
    damage_vulnerabilities.map { |damage| damage.name }
  end

  def saving_throws
    saves = []
    monster_proficiencies.each do |monster_prof|
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

  def skills
    skills = []
    monster_proficiencies.each do |monster_prof|
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
    speed_return
  end

  def hit_points_string
    hp_str = "#{hit_points} (#{hit_dice})"
    con_mod = DndRules.ability_score_modifier(constitution)
    num_hit_die = hit_dice.scan(/\d+/).first.to_i
    if con_mod > 0
      hp_str = "#{hit_points} (#{hit_dice} + #{con_mod * num_hit_die})"
    elsif con_mod < 0
      hp_str = "#{hit_points} (#{hit_dice} - #{con_mod.abs * num_hit_die})"
    end
    hp_str
  end

  def challenge_string
    "#{challenge_rating} (#{xp.to_s(:delimited)} XP)"
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    monster_type: 'B',
                    challenge_rating: 'C',
                    alignment: 'D'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  def to_param
    slug
  end

  def generate_slug
    self.slug = if user && !user.admin?
                  slug_from_string "#{name.parameterize}-#{user.username}"
                else
                  slug_from_string name.parameterize
                end
  end

  def slug_from_string(slug_string)
    class_num = 0
    new_slug = slug_string
    loop do
      new_slug = slug_string if class_num.zero?
      new_slug = "#{slug_string}-#{class_num}" if class_num.positive?
      break unless Monster.exists?(slug: new_slug)

      class_num += 1
    end
    new_slug
  end
end
