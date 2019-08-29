# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id              :bigint           not null, primary key
#  alignment       :string           default("neutral")
#  background      :string           default("Acolyte")
#  copper_pieces   :integer          default(0)
#  description     :text             default("Enter this character's backstory, history, or notes here.")
#  electrum_pieces :integer          default(0)
#  gold_pieces     :integer          default(0)
#  languages       :string           default("Common")
#  name            :string           not null
#  platinum_pieces :integer          default(0)
#  proficiency     :integer          default(2)
#  race            :string           default("Human"), not null
#  role            :string           default("Player Character")
#  silver_pieces   :integer          default(0), not null
#  slug            :string           not null
#  type            :string
#  xp              :integer          default(0), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :bigint
#
# Indexes
#
#  index_characters_on_slug     (slug)
#  index_characters_on_user_id  (user_id)
#

class Character < ApplicationRecord
  validates :name, presence: true

  after_validation(on: :create) do
    self.slug = generate_slug
  end

  before_save do
    self.proficiency = DndRules.proficiency_bonus_for_level(total_level)
  end

  attribute :min_score, :integer

  has_one :stat_block, dependent: :destroy
  accepts_nested_attributes_for :stat_block

  has_many :character_actions, dependent: :destroy

  has_many :equipment_items, inverse_of: :character

  has_many :skills, dependent: :destroy

  has_many :campaign_characters, dependent: :destroy
  has_many :campaigns, through: :campaign_characters

  has_many :character_classes, dependent: :destroy
  has_many :dnd_classes, through: :character_classes

  has_many :character_spells, dependent: :destroy
  has_many :spells, through: :character_spells

  has_many :character_adventures, dependent: :destroy
  has_many :adventures, through: :character_adventures

  accepts_nested_attributes_for :equipment_items, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :character_classes, reject_if: :all_blank, allow_destroy: true

  belongs_to :user

  def classes
    character_classes.map { |character_class| character_class.class_and_level }.join(', ')
  end

  def hit_dice
    hit_dice_array = []
    character_classes.each do |character_class|
      hit_dice_array << "#{character_class.level}d#{character_class.dnd_class.hit_die}"
    end
    hit_dice_array.join(', ')
  end

  def total_level
    character_classes.sum(&:level)
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A', description: 'B' },
                  using: { tsearch: { prefix: true } }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = Character.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize
  end
end
