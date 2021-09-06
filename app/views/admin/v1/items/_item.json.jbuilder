# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :slug, :api_url, :name, :equipment_category, :contents, :cost, :desc, :properties,
              :quantity, :special, :tool_category, :weight, :type, :user_id

if item.type == 'ArmorItem'
  json.extract! item, :armor_class, :armor_category,
                :armor_class_bonus, :stealth_disadvantage, :str_minimum
elsif item.type == 'MagicItem'
  json.extract! item, :rarity, :requires_attunement
elsif item.type == 'VehicleItem'
  json.extract! item, :vehicle_category, :speed
elsif item.type == 'WeaponItem'
  json.extract! item, :category_range, :damage, :range, :throw_range, :two_handed_damage, :weapon_category, :weapon_range
end
