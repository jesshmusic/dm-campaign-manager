class AddMagicItemTypeToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :magic_item_type, :string
  end
end
