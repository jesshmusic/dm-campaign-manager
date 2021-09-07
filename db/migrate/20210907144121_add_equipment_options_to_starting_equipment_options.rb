class AddEquipmentOptionsToStartingEquipmentOptions < ActiveRecord::Migration[6.1]
  def change
    add_reference :starting_equipment_options, :equipment_option, foreign_key: {to_table: :starting_equipment_options}
  end
end
