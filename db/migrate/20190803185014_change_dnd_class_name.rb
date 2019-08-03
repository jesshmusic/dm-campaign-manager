class ChangeDndClassName < ActiveRecord::Migration[5.2]
  def change
    change_column :dnd_classes, :name, :string
  end
end
