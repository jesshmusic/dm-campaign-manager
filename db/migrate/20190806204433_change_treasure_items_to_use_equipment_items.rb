class ChangeTreasureItemsToUseEquipmentItems < ActiveRecord::Migration[5.2]
  def change
    rename_column :treasure_items, :item_id, :equipment_item_id
  end
end
