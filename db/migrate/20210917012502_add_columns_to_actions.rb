class AddColumnsToActions < ActiveRecord::Migration[6.1]
  def change
    add_column :actions, :dc_type, :string
    add_column :actions, :dc_value, :integer
    add_column :actions, :success_type, :string
    add_column :actions, :usage_type, :string
    add_column :actions, :usage_dice, :string
    add_column :actions, :usage_min_value, :integer
  end
end
