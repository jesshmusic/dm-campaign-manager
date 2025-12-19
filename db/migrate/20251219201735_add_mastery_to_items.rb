class AddMasteryToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :mastery, :string
  end
end
