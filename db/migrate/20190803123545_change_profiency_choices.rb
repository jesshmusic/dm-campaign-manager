class ChangeProfiencyChoices < ActiveRecord::Migration[5.2]
  def change
    remove_column :dnd_classes, :proficiency_choices
    add_column :dnd_classes, :proficiency_choices, :jsonb, array: true, default: []
  end
end
