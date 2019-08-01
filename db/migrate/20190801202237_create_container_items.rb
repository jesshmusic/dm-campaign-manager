class CreateContainerItems < ActiveRecord::Migration[5.2]
  def change
    drop_table :item_content
    
    create_table :container_items do |t|
      t.belongs_to :item
      t.belongs_to :item_content
      t.index [:item_id, :item_content_id], unique: true

      t.timestamps
    end
  end
end
