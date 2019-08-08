class RemoveCharacterFromTreasure < ActiveRecord::Migration[5.2]
  def change
    remove_column :treasures, :character_id
  end
end
