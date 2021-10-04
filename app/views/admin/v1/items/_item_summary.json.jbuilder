# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item,
              # :id,
              :type,
              :weight,
              :name,
              :rarity,
              :requires_attunement,
              :slug
json.category item.category
json.cost "#{item.cost.quantity.to_s(:delimited)} #{item.cost.unit}" unless item.cost.nil?

unless item.content_items.nil? || item.content_items.count == 0
  json.contents item.content_items do |content_item|
    json.extract! content_item, :name, :quantity, :index
  end
end

case item.type
when 'ArmorItem', 'MagicArmorItem'
  json.armor_type item.armor_category
  dex_mod_string = ''
  if item.armor_class.has_dex_bonus && (item.armor_class.max_dex_bonus || item.armor_class.max_dex_bonus == 0)
    dex_mod_string = " + Dex modifier (max #{item.armor_class.max_dex_bonus})"
  elsif item.armor_class.has_dex_bonus
    dex_mod_string = ' + Dex modifier'
  end
  json.armor_class "#{item.armor_class.ac_base}" + dex_mod_string
  json.strength item.str_minimum.nil? || item.str_minimum == 0 ? '-' : "Str #{item.str_minimum}"
  json.stealth item.stealth_disadvantage ? 'Disadvantage' : '-'
when 'VehicleItem'
  json.extract! item, :vehicle_category, :speed, :capacity
when 'WeaponItem', 'MagicWeaponItem'
  json.extract! item, :category_range
  json.damage "#{item.damage.damage_dice} #{item.damage.damage_type}" unless item.damage.nil?
  json.properties item.properties_str
end
