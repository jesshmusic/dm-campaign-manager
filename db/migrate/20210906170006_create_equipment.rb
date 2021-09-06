class CreateEquipment < ActiveRecord::Migration[6.1]
  def change
    create_table :equipment do |t|
      t.integer :quantity
      t.string :name

      t.timestamps
    end
  end
end
