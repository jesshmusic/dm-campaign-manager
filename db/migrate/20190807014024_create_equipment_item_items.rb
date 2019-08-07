class CreateEquipmentItemItems < ActiveRecord::Migration[5.2]
  def change
    create_table :equipment_item_items do |t|
      t.belongs_to :item, index: true
      t.belongs_to :equipment_item, index: true
      t.timestamps
    end
  end
end
