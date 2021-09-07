class CreateCosts < ActiveRecord::Migration[6.1]
  def change
    create_table :costs do |t|
      t.integer :quantity
      t.string :unit
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    remove_column :items, :cost
  end
end
