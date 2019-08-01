class ChangeExistingTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :proficiency_classes
    add_column :dnd_classes, :proficiency_choices, :string, array: true, default: []
    add_column :dnd_classes, :proficiencies, :string, array: true, default: []
    add_column :dnd_classes, :saving_throws, :string, array: true, default: []
    
    create_table :items do |t|
      t.string :name
      t.string :category
      t.string :sub_category
      
      t.integer :armor_class
      t.boolean :armor_dex_bonus
      t.integer :armor_max_bonus
      t.integer :armor_str_minimum
      t.boolean :armor_stealth_disadvantage
      
      t.string :weapon_range
      t.integer :weapon_damage_dice_count
      t.integer :weapon_damage_dice_value
      t.string :weapon_damage_type
      t.integer :weapon_range_normal
      t.integer :weapon_range_long
      t.string :weapon_properties, array: true, default: []
      t.integer :weapon_thrown_range_normal
      t.integer :weapon_thrown_range_long
      t.integer :weapon_2h_damage_dice_count
      t.integer :weapon_2h_damage_dice_value
      t.string :weapon_2h_damage_type
      
      t.string :category_range
      
      t.text :description
      t.integer :weight
      
      t.integer :cost_value
      t.string :cost_unit
      
      t.string :api_url
      
      t.timestamps
    end
    
    create_table :item_content do |t|
      t.belongs_to :item
      t.belongs_to :item_content
      t.index [:item_id, :item_content_id], unique: true
      t.timestamps
    end
  end
end
