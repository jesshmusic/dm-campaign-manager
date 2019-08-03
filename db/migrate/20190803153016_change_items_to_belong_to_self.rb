class ChangeItemsToBelongToSelf < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :container_id, :integer, null: true, index: true
    add_foreign_key :items, :items, column: :container_id
  end
end
