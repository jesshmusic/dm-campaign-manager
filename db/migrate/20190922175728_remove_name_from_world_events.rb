class RemoveNameFromWorldEvents < ActiveRecord::Migration[5.2]
  def change
    remove_column :world_events, :name, :string
    add_column :world_locations, :name, :string, default: '', null: false
  end
end
