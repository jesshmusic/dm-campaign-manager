class RemoveUserFromAdventures < ActiveRecord::Migration[5.2]
  def change
    remove_reference :adventures, :user, foreign_key: true
  end
end
