# frozen_string_literal: true

# == Schema Information
#
# Table name: backgrounds
#
#  id                  :bigint           not null, primary key
#  ability_scores      :string           default([]), is an Array
#  description         :text
#  edition             :string           default("2024"), not null
#  equipment_option_a  :text
#  equipment_option_b  :text
#  feat_name           :string
#  homebrew            :boolean          default(FALSE), not null
#  name                :string           not null
#  skill_proficiencies :string           default([]), is an Array
#  slug                :string           not null
#  tool_proficiency    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_backgrounds_on_edition           (edition)
#  index_backgrounds_on_homebrew          (homebrew)
#  index_backgrounds_on_slug_and_edition  (slug,edition) UNIQUE
#  index_backgrounds_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Background < ApplicationRecord
  include Editionable
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  belongs_to :user, optional: true

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :edition }

  scope :srd, -> { where(homebrew: false) }
  scope :homebrew, -> { where(homebrew: true) }
  scope :for_user, ->(user) { where(user: user) }

  include PgSearch::Model

  multisearchable against: %i[name description feat_name]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    feat_name: 'B',
                    description: 'C'
                  },
                  using: { tsearch: { prefix: true } }
end
