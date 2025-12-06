class AddDescriptionToMonsters < ActiveRecord::Migration[7.1]
  def change
    add_column :monsters, :description, :text
  end
end
