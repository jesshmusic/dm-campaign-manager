class CreateEncounterMonsters < ActiveRecord::Migration[5.2]
  def change
    create_table :encounter_monsters do |t|
      t.references :monster, foreign_key: true
      t.references :encounter, foreign_key: true
      t.integer :number_of_monsters, default: 1

      t.timestamps
    end
  end
end
