class AddNameToProfChoices < ActiveRecord::Migration[5.2]
  def change
    add_column :prof_choices, :name, :string
  end
end
