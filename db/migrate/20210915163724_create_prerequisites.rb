class CreatePrerequisites < ActiveRecord::Migration[6.1]
  def change
    create_table :prerequisites do |t|
      t.string :name
      t.integer :level
      t.references :class_feature, null: false, foreign_key: true

      t.timestamps
    end
  end
end
