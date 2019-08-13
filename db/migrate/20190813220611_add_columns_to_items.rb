class AddColumnsToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :rarity, :string
    add_column :items, :requires_attunement, :string
  end
end
