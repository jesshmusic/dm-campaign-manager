class AddProficiencyToCharacters < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :proficiency, :integer, default: 2
  end
end
