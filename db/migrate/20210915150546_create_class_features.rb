class CreateClassFeatures < ActiveRecord::Migration[6.1]
  def change
    create_table :class_features do |t|
      t.string :desc
      t.integer :level
      t.string :name
      t.string :reference
      t.references :dnd_class_level, null: false, foreign_key: true

      t.timestamps
    end
  end
end
