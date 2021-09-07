class ChangeStartingEquipmentDndClassToOptional < ActiveRecord::Migration[6.1]
  def change
    change_column_null :starting_equipment_options, :dnd_class_id,  true
  end
end
