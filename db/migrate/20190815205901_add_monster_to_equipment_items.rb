class AddMonsterToEquipmentItems < ActiveRecord::Migration[5.2]
  def change
    add_reference :equipment_items, :encounter, foreign_key: true
  end
end
