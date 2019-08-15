class AddUserToAdventures < ActiveRecord::Migration[5.2]
  def change
    add_reference :adventures, :user, foreign_key: true
  end
end
