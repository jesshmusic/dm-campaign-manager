class CreateCharacterItems < ActiveRecord::Migration[5.2]
  def change
    create_table :character_items do |t|
      t.integer :quantity, default: 1, null: false
      t.boolean :equipped, default: false, null: false
      t.boolean :carrying, default: true, null: false
      t.references :item, foreign_key: true
      t.references :character, foreign_key: true

      t.timestamps
    end
  end
end
