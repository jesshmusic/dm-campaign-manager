class CreateSenses < ActiveRecord::Migration[6.1]
  def change
    create_table :senses do |t|
      t.string :blindsight
      t.string :darkvision
      t.integer :passive_perception
      t.string :tremorsense
      t.string :truesight
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
  end
end
