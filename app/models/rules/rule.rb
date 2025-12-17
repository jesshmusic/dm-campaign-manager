# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  edition     :string           default("2014"), not null
#  name        :string
#  slug        :string
#  subcategory :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_rules_on_edition           (edition)
#  index_rules_on_parent_id         (parent_id)
#  index_rules_on_slug_and_edition  (slug,edition) UNIQUE
#
class Rule < ApplicationRecord
  include Editionable
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  belongs_to :parent, class_name: 'Rule', optional: true
  has_many :children, class_name: 'Rule', foreign_key: 'parent_id'

  include PgSearch::Model

  # PgSearch
  multisearchable against: %i[name category subcategory description]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    category: 'B',
                    subcategory: 'C',
                    description: 'D'
                  },
                  using: { tsearch: { prefix: true } }
end
