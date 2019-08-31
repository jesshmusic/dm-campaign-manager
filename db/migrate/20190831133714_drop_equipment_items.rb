class DropEquipmentItems < ActiveRecord::Migration[5.2]
  def change
    drop_table :equipment_items
    drop_table :equipment_item_items
  end
end
