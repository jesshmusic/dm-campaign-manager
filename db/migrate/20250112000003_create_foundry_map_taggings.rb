class CreateFoundryMapTaggings < ActiveRecord::Migration[6.1]
  def change
    create_table :foundry_map_taggings do |t|
      t.references :foundry_map, null: false, foreign_key: true
      t.references :foundry_map_tag, null: false, foreign_key: true

      t.timestamps
    end

    add_index :foundry_map_taggings, [:foundry_map_id, :foundry_map_tag_id],
              unique: true,
              name: 'index_map_taggings_on_map_and_tag'
  end
end
