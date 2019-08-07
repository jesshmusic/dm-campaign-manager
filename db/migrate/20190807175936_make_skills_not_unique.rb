class MakeSkillsNotUnique < ActiveRecord::Migration[5.2]
  def change
    drop_table :monster_skills
    remove_index :skills, :name
    add_reference :skills, :monster, index: true
  end
end
