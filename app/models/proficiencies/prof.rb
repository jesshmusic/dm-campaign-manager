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
#

class Prof < ApplicationRecord
  validates :name, presence: true

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    description: 'B'
                  },
                  using: { tsearch: { prefix: true } }

  def to_param
    slug
  end
end
