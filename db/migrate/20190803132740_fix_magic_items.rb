class FixMagicItems < ActiveRecord::Migration[5.2]
  def change
    rename_column :magic_items, :type, :magic_item_type
  end
end
