class CreateEncounterItems < ActiveRecord::Migration[5.2]
  def change
    create_table :encounter_items do |t|
      t.integer :quantity, default: 1, null: false
      t.references :encounter, foreign_key: true
      t.references :item, foreign_key: true

      t.timestamps
    end
  end
end
