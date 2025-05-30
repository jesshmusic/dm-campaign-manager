# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id                   :bigint           not null, primary key
#  api_url              :string
#  armor_category       :string
#  armor_class_bonus    :integer
#  capacity             :string
#  category_range       :string
#  desc                 :string           default([]), is an Array
#  equipment_category   :string
#  gear_category        :string
#  magic_item_type      :string
#  name                 :string
#  properties           :string           default([]), is an Array
#  quantity             :integer
#  rarity               :string
#  requires_attunement  :string
#  slug                 :string
#  special              :string           default([]), is an Array
#  speed                :string
#  stealth_disadvantage :boolean
#  str_minimum          :integer
#  tool_category        :string
#  type                 :string
#  vehicle_category     :string
#  weapon_category      :string
#  weapon_range         :string
#  weight               :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  user_id              :bigint
#
# Indexes
#
#  index_items_on_armor_category    (armor_category)
#  index_items_on_category_range    (category_range)
#  index_items_on_slug              (slug) UNIQUE
#  index_items_on_tool_category     (tool_category)
#  index_items_on_user_id           (user_id)
#  index_items_on_vehicle_category  (vehicle_category)
#  index_items_on_weapon_category   (weapon_category)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Item < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  belongs_to :user, optional: true

  has_one :armor_class, dependent: :destroy
  has_many :content_items, dependent: :destroy
  has_one :cost, dependent: :destroy
  has_one :damage, dependent: :destroy
  has_one :item_range, dependent: :destroy
  has_one :item_throw_range, dependent: :destroy
  has_one :two_handed_damage, dependent: :destroy

  def category
    'Item'
  end

  include PgSearch::Model

  # PgSearch
  multisearchable against: [:name, :type, :desc, :properties]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    type: 'B',
                    desc: 'C',
                    properties: 'D'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
