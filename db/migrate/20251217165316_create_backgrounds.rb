class CreateBackgrounds < ActiveRecord::Migration[7.1]
  def change
    create_table :backgrounds do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :edition, default: '2024', null: false
      t.string :ability_scores, array: true, default: []
      t.string :feat_name
      t.string :skill_proficiencies, array: true, default: []
      t.string :tool_proficiency
      t.text :equipment_option_a
      t.text :equipment_option_b
      t.text :description
      t.boolean :homebrew, default: false, null: false
      t.references :user, foreign_key: true, null: true

      t.timestamps
    end

    add_index :backgrounds, [:slug, :edition], unique: true
    add_index :backgrounds, :edition
    add_index :backgrounds, :homebrew
  end
end
