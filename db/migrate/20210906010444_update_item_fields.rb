class UpdateItemFields < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :armor_category, :string
    add_index :items, :armor_category
    remove_column :items, :armor_class
    remove_column :items, :armor_dex_bonus
    remove_column :items, :armor_max_bonus
    rename_column :items, :armor_stealth_disadvantage, :stealth_disadvantage
    rename_column :items, :armor_str_minimum, :str_minimum
    add_column :items, :armor_class, :jsonb

    add_column :items, :capacity, :string

    add_index :items, :category_range

    remove_column :items, :cost_unit
    remove_column :items, :cost_value
    add_column :items, :cost, :jsonb

    add_column :items, :contents, :jsonb, array: true, default: []
    add_column :items, :damage, :jsonb
    remove_column :items, :description
    add_column :items, :desc, :string, array: true, default: []
    add_column :items, :equipment_category, :string
    add_column :items, :gear_category, :string
    add_column :items, :properties, :string, array: true, default: []
    add_column :items, :quantity, :integer
    add_column :items, :range, :jsonb
    add_column :items, :special, :string, array: true, default: []
    add_column :items, :speed, :jsonb
    remove_column :items, :sub_category
    add_column :items, :throw_range, :jsonb
    add_column :items, :tool_category, :string
    add_index :items, :tool_category
    add_column :items, :two_handed_damage, :jsonb
    add_column :items, :vehicle_category, :string
    add_index :items, :vehicle_category
    add_column :items, :weapon_category, :string
    add_index :items, :weapon_category

    # Remove all of the split out weapon stuff
    remove_column :items, :vehicle_capacity
    remove_column :items, :vehicle_speed
    remove_column :items, :vehicle_speed_unit
    remove_column :items, :weapon_2h_damage_dice_count
    remove_column :items, :weapon_2h_damage_dice_value
    remove_column :items, :weapon_2h_damage_type
    remove_column :items, :weapon_attack_bonus
    remove_column :items, :weapon_damage_bonus
    remove_column :items, :weapon_damage_dice_count
    remove_column :items, :weapon_damage_dice_value
    remove_column :items, :weapon_damage_type
    remove_column :items, :weapon_properties
    remove_column :items, :weapon_range_long
    remove_column :items, :weapon_range_normal
    remove_column :items, :weapon_thrown_range_long
    remove_column :items, :weapon_thrown_range_normal
  end
end
