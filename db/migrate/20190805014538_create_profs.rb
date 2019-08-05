class CreateProfs < ActiveRecord::Migration[5.2]
  def change
    create_table :prof_choices do |t|
      t.integer :num_choices
      t.string :prof_choice_type
      t.belongs_to :dnd_class, foreign_key: true, optional: true

      t.timestamps
    end

    create_table :profs do |t|
      t.string :name
      t.string :prof_type
      t.belongs_to :dnd_class, foreign_key: true, optional: true
      t.belongs_to :prof_choice, foreign_key: true, optional: true

      t.timestamps
    end
  end
end
