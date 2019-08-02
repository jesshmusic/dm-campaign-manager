class AddSkillsToMonsters < ActiveRecord::Migration[5.2]
  def change
    add_column :monsters, :skills, :jsonb, array: true, default: []
  end
end
