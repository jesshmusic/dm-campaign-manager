class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :name
      t.text :description
      t.references :campaign, foreign_key: true
      t.references :adventure, foreign_key: true
      t.references :encounter, foreign_key: true

      t.timestamps
    end
  end
end
