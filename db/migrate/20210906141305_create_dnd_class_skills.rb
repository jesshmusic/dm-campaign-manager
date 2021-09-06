class CreateDndClassSkills < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_skills do |t|
      t.references :dnd_class, null: false, foreign_key: true
      t.references :api_reference, null: false, foreign_key: true

      t.timestamps
    end
  end
end
