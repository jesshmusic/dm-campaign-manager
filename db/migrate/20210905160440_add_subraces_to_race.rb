class AddSubracesToRace < ActiveRecord::Migration[6.1]
  def change
    add_column :races, :subraces, :string, array: true, default: []
  end
end
