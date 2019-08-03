class AddLegendDescToMonsters < ActiveRecord::Migration[5.2]
  def change
    add_column :monsters, :legendary_description, :text
  end
end
