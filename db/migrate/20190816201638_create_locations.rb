class CreateLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :locations do |t|
      t.string :name
      t.text :description
      t.integer :map_x, default: 0
      t.integer :map_y, default: 0
      t.references :campaign, foreign_key: true
      t.references :adventure, foreign_key: true
      t.references :encounter, foreign_key: true

      t.timestamps
    end
  end
end
