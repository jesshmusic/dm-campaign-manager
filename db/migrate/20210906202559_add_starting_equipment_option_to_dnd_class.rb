class AddStartingEquipmentOptionToDndClass < ActiveRecord::Migration[6.1]
  def change
    add_reference :starting_equipment_options, :dnd_class, null: false, foreign_key: true
  end
end
