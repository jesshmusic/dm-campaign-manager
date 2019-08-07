class ChangeProfChoiceRelations < ActiveRecord::Migration[5.2]
  def change
    drop_table :prof_choice_classes
    add_reference :prof_choices, :dnd_class
  end
end
