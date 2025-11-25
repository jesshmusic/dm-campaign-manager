# frozen_string_literal: true

# == Schema Information
#
# Table name: profs
#
#  id         :bigint           not null, primary key
#  name       :string
#  prof_type  :string
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_profs_on_name  (name) UNIQUE
#  index_profs_on_slug  (slug) UNIQUE
#

class Prof < ApplicationRecord
  validates :name, presence: true
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    description: 'B'
                  },
                  using: { tsearch: { prefix: true } }
end
