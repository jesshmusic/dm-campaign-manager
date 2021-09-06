class CreateNewEquipmentItem < ActiveRecord::Migration[6.1]
  def change
    create_table :equipment_items do |t|
      t.references :equipment, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
