class ChangeContentItems < ActiveRecord::Migration[6.1]
  def change
    remove_reference :content_items, :content_item
    add_column :content_items, :name, :string, null: false
    add_column :content_items, :index, :string, null: false
    add_column :content_items, :quantity, :integer, default: 1
  end
end
