class RemoveQuantityFromItems < ActiveRecord::Migration[5.2]
  def change
    remove_column :items, :quantity
  end
end
