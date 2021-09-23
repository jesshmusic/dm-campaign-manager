# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :slug, :api_url, :name, :category, :equipment_category, :desc, :properties,
              :quantity, :special, :tool_category, :weight, :type, :user_id

json.category item.category

json.cost do
  json.extract! item.cost, :quantity, :unit unless item.cost.nil?
end

unless item.content_items.nil?
  json.contents item.content_items do |content_item|
    json.extract! content_item, :name, :quantity, :index
  end
end

case item.type
when 'ArmorItem'
  json.extract! item, :armor_category,
                :armor_class_bonus, :stealth_disadvantage, :str_minimum
  json.armor_class do
    json.extract! item.armor_class, :ac_base, :has_dex_bonus, :max_dex_bonus unless item.armor_class.nil?
  end
when 'MagicItem'
  json.extract! item, :rarity, :requires_attunement
when 'VehicleItem'
  json.extract! item, :vehicle_category, :speed
when 'WeaponItem'
  json.extract! item, :category_range, :weapon_category, :weapon_range
  json.damage do
    json.extract! item.damage, :damage_dice, :damage_type unless item.damage.nil?
  end
  json.two_handed_damage do
    json.extract! item.two_handed_damage, :damage_dice, :damage_type unless item.two_handed_damage.nil?
  end
  json.item_range do
    json.extract! item.item_range, :long, :normal unless item.item_range.nil?
  end
  json.item_throw_range do
    json.extract! item.item_throw_range, :long, :normal unless item.item_throw_range.nil?
  end
end
