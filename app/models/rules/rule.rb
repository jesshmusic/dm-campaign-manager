# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  name        :string
#  slug        :string
#  subcategory :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_rules_on_parent_id  (parent_id)
#
class Rule < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  belongs_to :parent, class_name: 'Rule', optional: true
  has_many :children, class_name: 'Rule', foreign_key: 'parent_id'
end
