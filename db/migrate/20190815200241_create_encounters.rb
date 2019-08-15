class CreateEncounters < ActiveRecord::Migration[5.2]
  def change
    create_table :encounters do |t|
      t.string :name
      t.text :description
      t.integer :platinum_pieces
      t.integer :gold_pieces
      t.integer :electrum_pieces
      t.integer :silver_pieces
      t.integer :copper_pieces
      t.integer :xp
      t.references :adventure, foreign_key: true

      t.timestamps
    end
  end
end
