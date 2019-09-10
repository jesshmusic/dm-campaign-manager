class AddRaceIdToCharacters < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :race_id, :integer, default: 1, null: false
  end
end
