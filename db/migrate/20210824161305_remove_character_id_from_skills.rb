class RemoveCharacterIdFromSkills < ActiveRecord::Migration[6.0]
  def change
    remove_column :skills, :character_id
  end
end
