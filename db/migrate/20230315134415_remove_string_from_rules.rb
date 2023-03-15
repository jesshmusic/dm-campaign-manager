class RemoveStringFromRules < ActiveRecord::Migration[6.1]
  def change
    remove_column :rules, :string
  end
end
