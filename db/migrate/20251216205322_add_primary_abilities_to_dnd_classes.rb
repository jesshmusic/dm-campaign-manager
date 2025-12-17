class AddPrimaryAbilitiesToDndClasses < ActiveRecord::Migration[7.1]
  def change
    add_column :dnd_classes, :primary_abilities, :string
  end
end
