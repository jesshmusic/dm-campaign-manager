class DropEquipmentItems < ActiveRecord::Migration[6.1]
  def change
    drop_table :equipment_items
  end
end
