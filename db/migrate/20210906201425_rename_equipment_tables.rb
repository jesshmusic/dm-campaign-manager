class RenameEquipmentTables < ActiveRecord::Migration[6.1]
  def change
    drop_table :starting_equipment_options
    rename_table :starting_equipment_choices, :starting_equipment_options
    add_reference :equipment, :starting_equipment_option, optional: true
    remove_reference :equipment, :dnd_class
    add_reference :equipment, :dnd_class, optional: true
  end
end
