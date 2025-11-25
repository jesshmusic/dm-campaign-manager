# == Schema Information
#
# Table name: skills
#
#  id            :bigint           not null, primary key
#  ability_score :string
#  desc          :string
#  name          :string
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_skills_on_slug  (slug) UNIQUE
#
class Skill < ApplicationRecord
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  include PgSearch::Model

  # PgSearch
  multisearchable against: %i[name desc]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    desc: 'B'
                  },
                  using: { tsearch: { prefix: true } }
end
