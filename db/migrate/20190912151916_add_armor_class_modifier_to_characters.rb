class AddArmorClassModifierToCharacters < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :armor_class_modifier, :integer, default: 0, null: false
  end
end
