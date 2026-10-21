class AddHomebrewToCompendiumEntries < ActiveRecord::Migration[7.1]
  # Besides the SRD and 2024 core book packs, the module can index the DM's
  # homebrew: world actors (pack "world.actors") and compendiums the DM picks,
  # each with its title as the label ("My Monsters")
  def change
    change_table :compendium_entries, bulk: true do |t|
      t.boolean :homebrew, null: false, default: false
      t.string :pack_label
    end
  end
end
