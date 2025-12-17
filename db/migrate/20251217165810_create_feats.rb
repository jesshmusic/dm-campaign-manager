class CreateFeats < ActiveRecord::Migration[7.1]
  def change
    create_table :feats do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :edition, default: '2024', null: false
      t.string :category, null: false
      t.string :prerequisite
      t.text :description, null: false
      t.boolean :repeatable, default: false, null: false
      t.boolean :homebrew, default: false, null: false
      t.references :user, foreign_key: true, null: true

      t.timestamps
    end

    add_index :feats, [:slug, :edition], unique: true
    add_index :feats, :edition
    add_index :feats, :category
    add_index :feats, :homebrew
  end
end
