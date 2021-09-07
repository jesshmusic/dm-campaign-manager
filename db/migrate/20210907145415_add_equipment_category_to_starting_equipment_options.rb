class AddEquipmentCategoryToStartingEquipmentOptions < ActiveRecord::Migration[6.1]
  def change
    add_column :starting_equipment_options, :equipment_category, :string
  end
end
