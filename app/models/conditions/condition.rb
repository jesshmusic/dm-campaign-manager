# == Schema Information
#
# Table name: conditions
#
#  id          :bigint           not null, primary key
#  description :string           default([]), is an Array
#  name        :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_conditions_on_slug  (slug) UNIQUE
#
class Condition < ApplicationRecord
  has_many :condition_immunities

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
