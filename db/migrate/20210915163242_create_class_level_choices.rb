class CreateClassLevelChoices < ActiveRecord::Migration[6.1]
  def change
    create_table :class_level_choices do |t|
      t.references :class_feature, null: false, foreign_key: true
      t.integer :num_choices
      t.string :name

      t.timestamps
    end
  end
end
