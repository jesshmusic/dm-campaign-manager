class CreateAdventureWorldLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :adventure_world_locations do |t|
      t.references :adventure, foreign_key: true
      t.references :world_location, foreign_key: true

      t.timestamps
    end
  end
end
