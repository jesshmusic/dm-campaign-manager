class RenameStartingEquipmentOptionType < ActiveRecord::Migration[6.1]
  def change
    rename_column :starting_equipment_options, :type, :equipment_type
  end
end
