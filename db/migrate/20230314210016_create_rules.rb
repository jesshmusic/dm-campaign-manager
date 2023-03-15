class CreateRules < ActiveRecord::Migration[6.1]
  def change
    create_table :rules do |t|
      t.string :name
      t.string :description
      t.string :category
      t.string :subcategory
      t.string :slug
      t.string :string

      t.timestamps
    end
  end
end
