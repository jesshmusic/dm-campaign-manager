class RemoveOldProfFieldsFromClass < ActiveRecord::Migration[5.2]
  def change
    remove_column :dnd_classes, :proficiencies
    remove_column :dnd_classes, :saving_throws
    remove_column :dnd_classes, :proficiency_choices
  end
end
