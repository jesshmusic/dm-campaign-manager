class RemoveDndClassSkills < ActiveRecord::Migration[6.1]
  def change
    drop_table :dnd_class_skills
  end
end
