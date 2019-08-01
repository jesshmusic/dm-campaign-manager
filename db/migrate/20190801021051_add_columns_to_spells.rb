class AddColumnsToSpells < ActiveRecord::Migration[5.2]
  def change
    add_column :spells, :school, :text
    add_column :spells, :api_url, :string
  end
end
