# frozen_string_literal: true

# Removes the conditions table as conditions are now stored as Rules
# in the Rules table under the "Conditions" category
class DropConditionsTable < ActiveRecord::Migration[7.1]
  def up
    # Remove from pg_search_documents first
    execute <<-SQL
      DELETE FROM pg_search_documents WHERE searchable_type = 'Condition';
    SQL

    drop_table :conditions
  end

  def down
    create_table :conditions do |t|
      t.string :name
      t.string :slug, null: false
      t.string :description, array: true, default: []
      t.string :edition, null: false, default: '2014'

      t.timestamps
    end

    add_index :conditions, :edition
    add_index :conditions, %i[slug edition], unique: true
  end
end
