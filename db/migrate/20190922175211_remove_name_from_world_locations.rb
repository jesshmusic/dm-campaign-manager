class RemoveNameFromWorldLocations < ActiveRecord::Migration[5.2]
  def change
    remove_column :world_locations, :name, :string
  end
end
