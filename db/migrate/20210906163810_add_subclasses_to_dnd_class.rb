class AddSubclassesToDndClass < ActiveRecord::Migration[6.1]
  def change
    add_column :dnd_classes, :subclasses, :string, array: true, default: []
  end
end
