FactoryBot.define do
  factory :item do
    api_url { "MyString" }
    armor_class { 1 }
    armor_dex_bonus { false }
    armor_max_bonus { 1 }
    armor_stealth_disadvantage { false }
    armor_str_minimum { 1 }
    category { "MyString" }
    category_range { "MyString" }
    cost_unit { "MyString" }
    cost_value { 1 }
    description { "MyText" }
    name { "MyString" }
    quantity { 1 }
    sub_category { "MyString" }
    vehicle_capacity { "MyString" }
    vehicle_speed { 1 }
    vehicle_speed_unit { "MyString" }
    weapon_2h_damage_dice_count { 1 }
    weapon_2h_damage_dice_value { 1 }
    weapon_2h_damage_type { "MyString" }
    weapon_damage_dice_count { 1 }
    weapon_damage_dice_value { 1 }
    weapon_damage_type { "MyString" }
    weapon_properties { "MyString" }
    weapon_range { "MyString" }
    weapon_range_long { 1 }
    weapon_range_normal { 1 }
    weapon_thrown_range_long { 1 }
    weapon_thrown_range_normal { 1 }
    weight { 1 }
  end
end
