# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string           default("neutral")
#  armor_class        :integer          default(10)
#  background         :string           default("Acolyte")
#  character_type     :string           default("pc"), not null
#  charisma           :integer          default(10), not null
#  constitution       :integer          default(10), not null
#  copper_pieces      :integer          default(0)
#  description        :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity          :integer          default(10), not null
#  electrum_pieces    :integer          default(0)
#  gold_pieces        :integer          default(0)
#  hit_dice_number    :integer          default(1), not null
#  hit_dice_value     :integer          default(8), not null
#  hit_points         :integer          default(8), not null
#  hit_points_current :integer          default(8), not null
#  initiative         :integer          default(0), not null
#  intelligence       :integer          default(10), not null
#  languages          :string           default("Common")
#  level              :integer          default(1), not null
#  name               :string           not null
#  platinum_pieces    :integer          default(0)
#  proficiency        :integer          default(2), not null
#  race               :string           default("Human"), not null
#  role               :string           default("Player Character")
#  silver_pieces      :integer          default(0), not null
#  slug               :string           not null
#  speed              :string           default("30 feet"), not null
#  spell_ability      :string           default("Intelligence")
#  spell_attack_bonus :integer          default(0)
#  spell_save_dc      :integer          default(8)
#  strength           :integer          default(10), not null
#  wisdom             :integer          default(10), not null
#  xp                 :integer          default(0), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  campaign_id        :bigint
#  user_id            :bigint
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#  index_characters_on_user_id      (user_id)
#

class Character < ApplicationRecord
  after_validation(on: :create) do
    self.slug = generate_slug
  end

  has_many :character_actions, dependent: :destroy

  has_many :campaign_characters, dependent: :destroy
  has_many :campaigns, through: :campaign_characters

  has_many :character_classes, dependent: :destroy
  has_many :dnd_classes, through: :character_classes

  has_many :equipment_items, inverse_of: :character
  has_many :skills, dependent: :destroy

  has_many :character_magic_items, dependent: :destroy
  has_many :magic_items, through: :character_magic_items

  has_many :character_spells, dependent: :destroy
  has_many :spells, through: :character_spells

  accepts_nested_attributes_for :equipment_items, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true

  belongs_to :user
  belongs_to :campaign

  def dnd_class_string
    dnd_classes.first.name
  end

  def dnd_class
    dnd_classes.first
  end

  def challenge_rating
    DndRules.cr_for_npc(self)
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
