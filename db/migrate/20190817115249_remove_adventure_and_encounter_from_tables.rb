class RemoveAdventureAndEncounterFromTables < ActiveRecord::Migration[5.2]
  def change
    remove_reference :world_locations, :adventure
    remove_reference :world_locations, :encounter
    remove_reference :world_events, :adventure
    remove_reference :world_events, :encounter
  end
end
