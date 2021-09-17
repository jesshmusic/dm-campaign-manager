# frozen_string_literal: true

# == Schema Information
#
# Table name: monsters
#
#  id                    :bigint           not null, primary key
#  alignment             :string
#  api_url               :string
#  armor_class           :integer          default(10)
#  challenge_rating      :string
#  charisma              :integer          default(10), not null
#  constitution          :integer          default(10), not null
#  dexterity             :integer          default(10), not null
#  hit_dice              :string
#  hit_points            :integer          default(8), not null
#  intelligence          :integer          default(10), not null
#  languages             :string
#  legendary_description :text
#  monster_subtype       :string
#  monster_type          :string
#  name                  :string
#  size                  :string
#  slug                  :string
#  strength              :integer          default(10), not null
#  wisdom                :integer          default(10), not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  user_id               :bigint
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

  has_many :damage_immunities, dependent: :destroy
  has_many :damage_resistances, dependent: :destroy
  has_many :damage_vulnerabilities, dependent: :destroy

  has_many :actions, dependent: :destroy
  has_many :legendary_actions, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_many :special_abilities, dependent: :destroy

  has_many :senses, dependent: :destroy
  has_many :speeds, dependent: :destroy

  has_many :monster_proficiencies
  has_many :profs, through: :monster_proficiencies

  has_many :condition_immunities
  has_many :conditions, through: :condition_immunities

  belongs_to :user, optional: true

  accepts_nested_attributes_for :actions, allow_destroy: true
  accepts_nested_attributes_for :legendary_actions, allow_destroy: true
  accepts_nested_attributes_for :reactions, allow_destroy: true
  accepts_nested_attributes_for :special_abilities, allow_destroy: true
  accepts_nested_attributes_for :senses, allow_destroy: true
  accepts_nested_attributes_for :speeds, allow_destroy: true
  accepts_nested_attributes_for :monster_proficiencies, allow_destroy: true
  accepts_nested_attributes_for :condition_immunities, allow_destroy: true
  accepts_nested_attributes_for :damage_immunities, allow_destroy: true
  accepts_nested_attributes_for :damage_resistances, allow_destroy: true
  accepts_nested_attributes_for :damage_vulnerabilities, allow_destroy: true

  def xp
    DndRules.xp_for_cr(challenge_rating)
  end

  def initiative
    DndRules.ability_score_modifier(dexterity)
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

  private

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
