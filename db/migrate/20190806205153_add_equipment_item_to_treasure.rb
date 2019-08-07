class AddEquipmentItemToTreasure < ActiveRecord::Migration[5.2]
  def change
    add_reference :equipment_items, :treasure, index: true
  end
end
