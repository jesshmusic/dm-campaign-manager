class AddReactionsToMonsters < ActiveRecord::Migration[5.2]
  def change
    add_column :monsters, :reactions, :text
  end
end
