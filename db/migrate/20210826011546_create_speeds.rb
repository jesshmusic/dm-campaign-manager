class CreateSpeeds < ActiveRecord::Migration[6.1]
  def change
    create_table :speeds do |t|
      t.string :burrow
      t.string :climb
      t.string :fly
      t.boolean :hover
      t.string :swim
      t.string :walk
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
  end
end
