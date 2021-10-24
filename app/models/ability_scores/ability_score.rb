# == Schema Information
#
# Table name: ability_scores
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  full_name  :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class AbilityScore < ApplicationRecord
  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    desc: 'B'
                  },
                  using: { tsearch: { prefix: true } }

  def to_param
    slug
  end
end
