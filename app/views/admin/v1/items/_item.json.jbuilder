# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :api_url, :armor_class, :armor_dex_bonus,
              :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum,
              :category, :category_range, :cost_unit, :cost_value, :description,
              :name, :sub_category, :vehicle_capacity, :vehicle_speed, :vehicle_speed_unit,
              :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value, :weapon_2h_damage_type,
              :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type,
              :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal,
              :weapon_thrown_range_long, :weapon_thrown_range_normal, :weight, :type
json.contained_items item.contained_items
json.url v1_item_url(item, format: :json)
