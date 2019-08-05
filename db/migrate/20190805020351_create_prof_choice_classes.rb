class CreateProfChoiceClasses < ActiveRecord::Migration[5.2]
  def change
    create_table :prof_choice_classes do |t|
      t.belongs_to :dnd_class, index: true
      t.belongs_to :prof_choice, index: true

      t.timestamps
    end
  end
end
