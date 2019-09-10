class RemoveCharacterRaces < ActiveRecord::Migration[5.2]
  def change
    drop_table :character_races
  end
end
