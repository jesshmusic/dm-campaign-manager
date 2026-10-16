class CreateCompendiumEntries < ActiveRecord::Migration[7.1]
  # The index of a DM's Foundry compendiums (SRD 5.2 and the 2024 core books
  # they own), sent by the Campaign Planner module: names, CRs and compendium
  # UUIDs only, never stat blocks or book text. Private to each DM.
  def change
    create_table :compendium_entries do |t|
      t.references :user, null: false, foreign_key: true, index: false
      t.string :pack, null: false
      t.string :pack_version
      t.string :foundry_uuid, null: false
      t.string :name, null: false
      t.string :category, null: false
      t.string :challenge_rating
      t.string :detail
      t.timestamps
    end
    add_index :compendium_entries, %i[user_id foundry_uuid], unique: true
    add_index :compendium_entries, %i[user_id pack]
    add_index :compendium_entries, %i[user_id category name]
  end
end
