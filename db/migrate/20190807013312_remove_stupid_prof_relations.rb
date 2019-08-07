class RemoveStupidProfRelations < ActiveRecord::Migration[5.2]
  def change
    remove_column :items, :equipment_item_id
    remove_column :profs, :prof_choice_id
  end
end
