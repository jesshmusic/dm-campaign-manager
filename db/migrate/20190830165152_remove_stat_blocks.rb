class RemoveStatBlocks < ActiveRecord::Migration[5.2]
  def change
    drop_table :stat_blocks
  end
end
