class AddUserToPlayerCharacter < ActiveRecord::Migration[5.2]
  def change
    add_reference :player_characters, index: true
  end
end
