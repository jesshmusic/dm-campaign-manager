class RenameLocationToWorldLocation < ActiveRecord::Migration[5.2]
  def change
    rename_table :locations, :world_locations
    remove_reference :world_locations, :adventure
    remove_reference :world_locations, :encounter
  end
end
