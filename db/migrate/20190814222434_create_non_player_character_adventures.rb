class CreateNonPlayerCharacterAdventures < ActiveRecord::Migration[5.2]
  def change
    create_table :non_player_character_adventures do |t|
      t.references :adventure, foreign_key: true
      t.references :character, foreign_key: true

      t.timestamps
    end
  end
end
