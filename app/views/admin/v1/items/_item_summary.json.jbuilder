# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :type, :weight, :name,
              :rarity, :requires_attunement, :slug
json.category item.category
json.cost "#{item.cost.quantity.to_s(:delimited)} #{item.cost.unit}" unless item.cost.nil?

unless item.content_items.nil? || item.content_items.count == 0
  json.contents item.content_items do |content_item|
    json.extract! content_item, :name, :quantity, :index
  end
end

case item.type
when 'ArmorItem'
  json.armor_type "#{item.armor_category} Armor"
  json.base_ac item.armor_class.ac_base
when 'VehicleItem'
  json.extract! item, :vehicle_category, :speed
when 'WeaponItem'
  json.extract! item, :category_range
  damage = ''
  damage = "#{item.damage.damage_dice}, #{item.damage.damage_type}" unless item.damage.nil?
  if item.two_handed_damage
    damage += ", two-handed: #{item.two_handed_damage.damage_dice}, #{item.two_handed_damage.damage_type}"
  end
  json.damage damage

  json.item_range do
    json.extract! item.item_range, :long, :normal unless item.item_range.nil?
  end
  json.item_throw_range do
    json.extract! item.item_throw_range, :long, :normal unless item.item_throw_range.nil?
  end
end
