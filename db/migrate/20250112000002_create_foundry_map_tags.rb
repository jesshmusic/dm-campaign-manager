class CreateFoundryMapTags < ActiveRecord::Migration[6.1]
  def change
    create_table :foundry_map_tags do |t|
      t.string :name, null: false
      t.string :slug, null: false

      t.timestamps
    end

    add_index :foundry_map_tags, :slug, unique: true
    add_index :foundry_map_tags, :name
  end
end
