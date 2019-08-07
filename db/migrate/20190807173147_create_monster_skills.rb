class CreateMonsterSkills < ActiveRecord::Migration[5.2]
  def change
    create_table :monster_skills do |t|
      t.references :monster, index: true
      t.references :skill, index: true

      t.timestamps
    end
  end
end
