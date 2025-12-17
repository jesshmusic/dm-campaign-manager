# frozen_string_literal: true

# == Schema Information
#
# Table name: feats
#
#  id           :bigint           not null, primary key
#  category     :string           not null
#  description  :text             not null
#  edition      :string           default("2024"), not null
#  homebrew     :boolean          default(FALSE), not null
#  name         :string           not null
#  prerequisite :string
#  repeatable   :boolean          default(FALSE), not null
#  slug         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint
#
# Indexes
#
#  index_feats_on_category          (category)
#  index_feats_on_edition           (edition)
#  index_feats_on_homebrew          (homebrew)
#  index_feats_on_slug_and_edition  (slug,edition) UNIQUE
#  index_feats_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Feat < ApplicationRecord
  include Editionable
  extend FriendlyId

  CATEGORIES = ['Origin', 'General', 'Fighting Style', 'Epic Boon'].freeze

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  belongs_to :user, optional: true

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :edition }
  validates :category, presence: true, inclusion: { in: CATEGORIES }
  validates :description, presence: true

  scope :srd, -> { where(homebrew: false) }
  scope :homebrew, -> { where(homebrew: true) }
  scope :for_user, ->(user) { where(user: user) }
  scope :by_category, ->(category) { where(category: category) }

  include PgSearch::Model

  multisearchable against: %i[name category description prerequisite]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    category: 'B',
                    prerequisite: 'C',
                    description: 'D'
                  },
                  using: { tsearch: { prefix: true } }
end
