class RemoveSkillsJsonFromMonsters < ActiveRecord::Migration[5.2]
  def change
    remove_column :monsters, :skills
  end
end
