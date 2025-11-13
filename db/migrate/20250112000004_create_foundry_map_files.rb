class CreateFoundryMapFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :foundry_map_files do |t|
      t.references :foundry_map, null: false, foreign_key: true
      t.string :file_path, null: false
      t.string :file_type, null: false # 'scene', 'asset', 'thumbnail'
      t.bigint :file_size
      t.string :s3_key, null: false
      t.string :content_type

      t.timestamps
    end

    add_index :foundry_map_files, :s3_key, unique: true
    add_index :foundry_map_files, :file_type
  end
end
