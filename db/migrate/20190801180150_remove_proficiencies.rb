class RemoveProficiencies < ActiveRecord::Migration[5.2]
  def change
    drop_table :proficiencies
  end
end
