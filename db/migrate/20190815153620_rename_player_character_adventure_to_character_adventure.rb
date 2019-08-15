class RenamePlayerCharacterAdventureToCharacterAdventure < ActiveRecord::Migration[5.2]
  def change
    drop_table :non_player_character_adventures
    rename_table :player_character_adventures, :character_adventures
  end
end
