class RenameEventToWorldEvent < ActiveRecord::Migration[5.2]
  def change
    rename_table :events, :world_events
    remove_reference :world_events, :adventure
    remove_reference :world_events, :encounter
  end
end
