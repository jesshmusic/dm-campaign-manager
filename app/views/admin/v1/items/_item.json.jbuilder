# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :name, :category,
              :sub_category, :cost_unit, :cost_value,
              :description, :weight, :type, :user_id

json.excerpt strip_tags(item.description).truncate_words(20, omission: '...') unless item.description.nil?

if item.type == 'ArmorItem'
  json.extract! item, :armor_class, :armor_dex_bonus,
                :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum,
                :armor_class_bonus
elsif item.type == 'MagicItem'
  json.extract! item, :rarity, :requires_attunement
elsif item.type == 'VehicleItem'
  json.extract! item, :vehicle_capacity, :vehicle_speed, :vehicle_speed_unit
elsif item.type == 'WeaponItem'
  json.extract! item, :category_range, :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value,
                :weapon_2h_damage_type, :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type,
                :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long,
                :weapon_thrown_range_normal, :weapon_attack_bonus, :weapon_damage_bonus
end
json.contained_items item.contained_items do |next_item|
  json.extract! next_item, :id, :name, :category, :sub_category, :cost_unit, :cost_value, :description, :weight, :type
  if next_item.type == 'ArmorItem'
    json.extract! next_item, :armor_class, :armor_dex_bonus,
                  :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum,
                  :armor_class_bonus
  elsif next_item.type == 'MagicItem'
    json.extract! next_item, :rarity, :requires_attunement
  elsif next_item.type == 'VehicleItem'
    json.extract! next_item, :vehicle_capacity, :vehicle_speed, :vehicle_speed_unit
  elsif next_item.type == 'WeaponItem'
    json.extract! next_item, :category_range, :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value,
                  :weapon_2h_damage_type, :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type,
                  :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long,
                  :weapon_thrown_range_normal, :weapon_attack_bonus, :weapon_damage_bonus
  end
end
