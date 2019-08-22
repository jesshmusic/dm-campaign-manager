class AddUserLocationAndInfoToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :location, :string
    add_column :users, :info, :text
  end
end
