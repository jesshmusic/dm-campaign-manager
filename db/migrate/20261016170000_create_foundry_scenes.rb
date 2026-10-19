class CreateFoundryScenes < ActiveRecord::Migration[7.1]
  # Thumbnails of the scenes a DM's campaigns use as maps, sent by Dorman
  # Lakely's Campaign Planner so they show here while Foundry is closed. The
  # image is in S3; `version` changes when the scene's map does.
  def change
    create_table :foundry_scenes do |t|
      t.references :user, null: false, foreign_key: true, index: false
      t.string :world_id, null: false
      t.string :world_title
      t.string :foundry_uuid, null: false
      t.string :name, null: false
      t.string :version, null: false
      t.string :thumbnail_s3_key, null: false
      t.string :thumbnail_url, null: false
      t.timestamps
    end
    add_index :foundry_scenes, %i[user_id world_id foundry_uuid], unique: true
    add_index :foundry_scenes, %i[user_id foundry_uuid]
  end
end
