class RenameMessedUpPcColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :player_characters, "{:index=>true}_id", :user_id
  end
end
