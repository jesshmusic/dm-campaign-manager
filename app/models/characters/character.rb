# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string           default("neutral")
#  background         :string           default("Acolyte")
#  copper_pieces      :integer          default(0)
#  description        :text             default("Enter this character's backstory, history, or notes here.")
#  electrum_pieces    :integer          default(0)
#  gold_pieces        :integer          default(0)
#  languages          :string           default("Common")
#  level              :integer          default(1)
#  name               :string           not null
#  platinum_pieces    :integer          default(0)
#  race               :string           default("Human"), not null
#  role               :string           default("Player Character")
#  silver_pieces      :integer          default(0), not null
#  slug               :string           not null
#  spell_ability      :string           default("Intelligence")
#  spell_attack_bonus :integer          default(0)
#  spell_save_dc      :integer          default(8)
#  type               :string
#  xp                 :integer          default(0), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  user_id            :bigint
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

  belongs_to :user

  def dnd_class_string
    dnd_classes.first.name
  end

  def dnd_class
    dnd_classes.first
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
