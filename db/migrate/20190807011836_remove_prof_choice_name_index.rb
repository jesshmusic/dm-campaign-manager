class RemoveProfChoiceNameIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index :prof_choices, :name
  end
end
