class CreateTreasures < ActiveRecord::Migration[5.2]
  def change
    create_table :treasures do |t|
      t.string :name
      t.text :description
      t.integer :copper_pieces
      t.integer :silver_pieces
      t.integer :gold_pieces
      t.integer :platinum_pieces
      t.string :slug
      t.belongs_to :user, index: true
      t.belongs_to :monster, index: true

      t.timestamps
    end
    
    create_table :treasures_items do |t|
      t.belongs_to :treasure, index: true
      t.belongs_to :item, index: true

      t.timestamps
    end
    
    create_table :treasure_magic_items do |t|
      t.belongs_to :treasure, index: true
      t.belongs_to :magic_item, index: true

      t.timestamps
    end
  end
end
