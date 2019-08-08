class CreatePlayerCharacters < ActiveRecord::Migration[5.2]
  def change
    create_table :player_characters do |t|
      t.string :name
      t.text :description
      t.string :slug

      t.timestamps
    end
    
    add_reference :character_stats, :player_character, index: true
    
    add_column :character_stats, :copper_pieces, :integer
    add_column :character_stats, :silver_pieces, :integer
    add_column :character_stats, :gold_pieces, :integer
    add_column :character_stats, :platinum_pieces, :integer
    add_column :character_stats, :hit_points_current, :integer
  end
end
