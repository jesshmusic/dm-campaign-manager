class AddOrderAndGameIconToRules < ActiveRecord::Migration[7.1]
  def change
    add_column :rules, :sort_order, :integer
    add_column :rules, :game_icon, :string
  end
end
