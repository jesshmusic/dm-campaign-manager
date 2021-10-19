class AddAuthIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :auth_id, :string, null: false, default: '', unique: true
  end
end
