class CreateMultiClassPrereqs < ActiveRecord::Migration[6.1]
  def change
    create_table :multi_class_prereqs do |t|
      t.string :ability_score
      t.integer :minimum_score
      t.references :multi_classing, optional: true
      t.references :multi_classing_prereq_option, optional: true

      t.timestamps
    end
  end
end
