class AddRollTablesToCampaignLocations < ActiveRecord::Migration[7.1]
  # A place's random encounter tables: Foundry roll tables the DM drops on the
  # place in Foundry, [{ "uuid": "RollTable.xxxx", "name": "Moathouse encounters" }]
  def change
    add_column :campaign_locations, :roll_tables, :jsonb, null: false, default: []
  end
end
