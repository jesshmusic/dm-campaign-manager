class AddLocationToEncounters < ActiveRecord::Migration[5.2]
  def change
    add_column :encounters, :location, :string, default: 'New Location', null: false
  end
end
