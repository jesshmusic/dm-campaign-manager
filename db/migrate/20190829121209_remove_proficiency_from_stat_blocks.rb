class RemoveProficiencyFromStatBlocks < ActiveRecord::Migration[5.2]
  def change
    remove_column :stat_blocks, :proficiency, :integer
  end
end
