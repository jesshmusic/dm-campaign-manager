# frozen_string_literal: true

# == Schema Information
#
# Table name: dnd_classes
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  hit_die       :integer
#  name          :string
#  slug          :string
#  spell_ability :string
#  subclasses    :string           default([]), is an Array
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class DndClass < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  has_many :ability_score_dnd_classes, dependent: :destroy
  has_many :ability_scores, -> { distinct }, through: :ability_score_dnd_classes

  has_many :dnd_class_levels, dependent: :destroy

  has_many :equipments, dependent: :destroy
  has_many :starting_equipment_options, dependent: :destroy

  has_many :prof_choices, inverse_of: :dnd_class
  has_many :prof_classes, dependent: :destroy
  has_many :profs, -> { distinct }, through: :prof_classes

  has_one :multi_classing, dependent: :destroy

  has_one :spell_casting, dependent: :destroy

  has_many :spell_classes, dependent: :destroy
  has_many :spells, -> { distinct }, through: :spell_classes

  belongs_to :user, optional: true

  accepts_nested_attributes_for :dnd_class_levels, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :equipments, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :multi_classing, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :prof_choices, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :spell_casting, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :starting_equipment_options, reject_if: :all_blank, allow_destroy: true

  include PgSearch::Model

  # PgSearch
  multisearchable against: [:name]
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }
end
