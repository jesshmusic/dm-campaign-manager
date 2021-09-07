# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id                   :bigint           not null, primary key
#  api_url              :string
#  armor_category       :string
#  armor_class          :jsonb
#  armor_class_bonus    :integer
#  capacity             :string
#  category_range       :string
#  contents             :jsonb            is an Array
#  damage               :jsonb
#  desc                 :string           default([]), is an Array
#  equipment_category   :string
#  gear_category        :string
#  magic_item_type      :string
#  name                 :string
#  properties           :string           default([]), is an Array
#  quantity             :integer
#  range                :jsonb
#  rarity               :string
#  requires_attunement  :string
#  slug                 :string
#  special              :string           default([]), is an Array
#  speed                :jsonb
#  stealth_disadvantage :boolean
#  str_minimum          :integer
#  throw_range          :jsonb
#  tool_category        :string
#  two_handed_damage    :jsonb
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

class MagicItem < Item
  def category
    'Magic Item'
  end

  class << self
    def create_magic_item_from_old_magic_items(magic_item)
      new_item_name = magic_item[:name]
      new_item_slug = new_item_name.parameterize
      new_item = MagicItem.find_or_create_by(slug: new_item_slug)
      new_item.name = new_item_name
      new_item.description = magic_item[:desc]
      new_item.rarity = magic_item[:rarity]
      new_item.cost = Cost.create(quantity: MagicItemsUtility.cost_for_rarity(magic_item[:rarity]), unit: 'gp')
      new_item.requires_attunement = magic_item[:requires_attunement]
      new_item.slug = new_item_slug
      new_item.save!
    end
  end
end
