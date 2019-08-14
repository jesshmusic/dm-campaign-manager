class CreateAdventures < ActiveRecord::Migration[5.2]
  def change
    create_table :adventures do |t|
      t.string :name
      t.text :description
      t.references :campaign, foreign_key: true

      t.timestamps
    end
  end
end
