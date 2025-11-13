class CreateFoundryMaps < ActiveRecord::Migration[6.1]
  def change
    create_table :foundry_maps do |t|
      t.string :name, null: false
      t.text :description
      t.string :thumbnail_url
      t.string :access_level, null: false, default: 'free' # 'free' or 'premium'
      t.integer :grid_size
      t.string :grid_units
      t.integer :width
      t.integer :height
      t.boolean :published, default: false
      t.integer :download_count, default: 0
      t.json :keywords, default: []

      t.timestamps
    end

    add_index :foundry_maps, :access_level
    add_index :foundry_maps, :published
    add_index :foundry_maps, :created_at
  end
end
