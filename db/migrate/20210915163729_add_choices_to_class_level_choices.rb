class AddChoicesToClassLevelChoices < ActiveRecord::Migration[6.1]
  def change
    add_column :class_level_choices, :choices, :string, array: true, default: []
  end
end
