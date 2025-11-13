class AddThumbnailS3KeyToFoundryMaps < ActiveRecord::Migration[6.1]
  def change
    add_column :foundry_maps, :thumbnail_s3_key, :string
  end
end
