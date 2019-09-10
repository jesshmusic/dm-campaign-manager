class CreateCharacterRaces < ActiveRecord::Migration[5.2]
  def change
    create_table :character_races do |t|
      t.references :character, foreign_key: true
      t.references :race, foreign_key: true

      t.timestamps
    end
  end
end
