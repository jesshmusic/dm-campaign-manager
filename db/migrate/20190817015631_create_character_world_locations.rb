class CreateCharacterWorldLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :character_world_locations do |t|
      t.references :character, foreign_key: true
      t.references :world_location, foreign_key: true

      t.timestamps
    end
  end
end
