class CreateDndClassLevels < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_levels do |t|
      t.integer :ability_score_bonuses
      t.references :dnd_class, null: false, foreign_key: true
      t.integer :level
      t.integer :prof_bonus

      t.timestamps
    end
  end
end
