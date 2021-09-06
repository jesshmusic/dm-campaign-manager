class CreateStartingEquipmentOptions < ActiveRecord::Migration[6.1]
  def change
    create_table :starting_equipment_options do |t|
      t.integer :quantity
      t.string :name
      t.string :slug

      t.timestamps
    end
  end
end
