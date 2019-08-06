class ChangeTreasuresItemsToTreasureItems < ActiveRecord::Migration[5.2]
  def change
    rename_table :treasures_items, :treasure_items
  end
end
