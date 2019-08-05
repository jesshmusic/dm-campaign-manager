class AddUniqueIndexesToProfsAndChoices < ActiveRecord::Migration[5.2]
  def change
    add_index :profs, :name, unique: true
    add_index :prof_choices, :name, unique: true
  end
end
