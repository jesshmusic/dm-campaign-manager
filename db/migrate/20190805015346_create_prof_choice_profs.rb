class CreateProfChoiceProfs < ActiveRecord::Migration[5.2]
  def change
    create_table :prof_choice_profs do |t|
      t.belongs_to :prof, index: true
      t.belongs_to :prof_choice, index: true

      t.timestamps
    end
    
    create_table :prof_classes do |t|
      t.belongs_to :prof, index: true
      t.belongs_to :dnd_class, index: true

      t.timestamps
    end
    
    remove_column :profs, :prof_choice_id
    remove_column :profs, :dnd_class_id
    remove_column :prof_choices, :dnd_class_id
  end
end
