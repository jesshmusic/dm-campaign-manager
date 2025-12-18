# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  edition     :string           default("2014"), not null
#  game_icon   :string
#  name        :string
#  slug        :string
#  sort_order  :integer
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

  # Navigation methods for prev/next traversal
  def previous_rule
    flattened = self.class.flattened_tree(edition)
    idx = flattened.index { |r| r.id == id }
    idx&.positive? ? flattened[idx - 1] : nil
  end

  def next_rule
    flattened = self.class.flattened_tree(edition)
    idx = flattened.index { |r| r.id == id }
    idx && idx < flattened.length - 1 ? flattened[idx + 1] : nil
  end

  def self.flattened_tree(edition)
    Rails.cache.fetch("rules_flattened_#{edition}", expires_in: 1.hour) do
      build_flattened_tree(edition)
    end
  end

  def self.build_flattened_tree(edition)
    result = []
    roots = for_edition(edition).where(parent_id: nil).order(Arel.sql('COALESCE(sort_order, 999)'), :name)
    roots.each { |root| traverse_tree(root, result) }
    result
  end

  def self.traverse_tree(rule, result)
    result << rule
    rule.children.order(Arel.sql('COALESCE(sort_order, 999)'), :name).each do |child|
      traverse_tree(child, result)
    end
  end

  private_class_method :build_flattened_tree, :traverse_tree
end
