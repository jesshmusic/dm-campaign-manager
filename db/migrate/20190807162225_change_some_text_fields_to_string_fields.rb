class ChangeSomeTextFieldsToStringFields < ActiveRecord::Migration[5.2]
  def change
    drop_table :actions
    change_column :spells, :name, :string
    change_column :spells, :page, :string
    change_column :spells, :range, :string
    change_column :spells, :material, :string
    change_column :spells, :duration, :string
    change_column :spells, :school, :string
  end
end
