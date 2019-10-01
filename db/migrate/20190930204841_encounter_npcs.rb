class EncounterNpcs < ActiveRecord::Migration[5.2]
  def change
    create_table :encounter_npcs do |t|
      t.references :character, foreign_key: true
      t.references :encounter, foreign_key: true

      t.timestamps
    end
  end
end
