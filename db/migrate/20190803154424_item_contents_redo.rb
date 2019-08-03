class ItemContentsRedo < ActiveRecord::Migration[5.2]
  def change
    drop_table :container_items
    remove_column :items, :container_id
    
    create_table :container_items do |t|
      t.references :item, index: true, foreign_key: true
      t.references :contained_item, index: true
      t.timestamps
    end
    
    add_foreign_key :container_items, :items, column: :contained_item_id
    add_index :container_items, [:item_id, :contained_item_id], unique: true
  end
end
