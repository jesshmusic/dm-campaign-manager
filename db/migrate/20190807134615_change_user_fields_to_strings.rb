class ChangeUserFieldsToStrings < ActiveRecord::Migration[5.2]
  def change
    change_column :users, :name, :string
    change_column :users, :username, :string
  end
end
