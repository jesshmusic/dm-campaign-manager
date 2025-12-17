# == Schema Information
#
# Table name: ability_scores
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  edition    :string           default("2014"), not null
#  full_name  :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_ability_scores_on_edition  (edition)
#  index_ability_scores_on_slug     (slug) UNIQUE
#
class AbilityScore < ApplicationRecord
  include Editionable
  include PgSearch::Model

  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    full_name: 'B',
                    desc: 'C'
                  },
                  using: { tsearch: { prefix: true } }
end
