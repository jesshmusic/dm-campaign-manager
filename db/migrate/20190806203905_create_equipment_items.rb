class CreateEquipmentItems < ActiveRecord::Migration[5.2]
  def change
    create_table :equipment_items do |t|
      t.integer :quantity

      t.timestamps
    end

    add_reference :items, :equipment_item, index: true
  end
end
