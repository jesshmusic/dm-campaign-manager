# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string           default("neutral")
#  armor_class        :integer          default(10), not null
#  background         :string           default("Acolyte")
#  charisma           :integer          default(10), not null
#  constitution       :integer          default(10), not null
#  copper_pieces      :integer          default(0)
#  description        :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity          :integer          default(10), not null
#  electrum_pieces    :integer          default(0)
#  gold_pieces        :integer          default(0)
#  hit_points         :integer          default(8), not null
#  hit_points_current :integer          default(8), not null
#  initiative         :integer          default(0), not null
#  intelligence       :integer          default(10), not null
#  languages          :string           default("Common")
#  name               :string           not null
#  platinum_pieces    :integer          default(0)
#  proficiency        :integer          default(2)
#  race               :string           default("Human"), not null
#  role               :string           default("Player Character")
#  silver_pieces      :integer          default(0), not null
#  slug               :string           not null
#  speed              :string           default("30 feet"), not null
#  strength           :integer          default(10), not null
#  type               :string
#  wisdom             :integer          default(10), not null
#  xp                 :integer          default(0), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  campaign_id        :bigint
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
  validates :name, presence: true
  validates :character_classes, length: { minimum: 1 }

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

  belongs_to :campaign

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
