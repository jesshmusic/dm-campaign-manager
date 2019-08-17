class RemoveAdventureAndEncounterFromTables < ActiveRecord::Migration[5.2]
  def change
    remove_reference :world_locations, :adventure, foreign_key: true
    remove_reference :world_locations, :encounter, foreign_key: true
    remove_reference :world_events, :adventure, foreign_key: true
    remove_reference :world_events, :encounter, foreign_key: true
  end
end
