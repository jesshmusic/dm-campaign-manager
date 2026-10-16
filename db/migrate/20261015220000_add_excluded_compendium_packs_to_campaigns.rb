class AddExcludedCompendiumPacksToCampaigns < ActiveRecord::Migration[7.1]
  # Foundry compendium packs the DM turned off for this campaign. Stored as
  # the ones turned off, so a book indexed later is on by default.
  def change
    add_column :campaigns, :excluded_compendium_packs, :jsonb, null: false, default: []
  end
end
