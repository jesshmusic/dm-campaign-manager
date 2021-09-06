class DropContainersTable < ActiveRecord::Migration[6.1]
  def change
    drop_table :container_items
  end
end
