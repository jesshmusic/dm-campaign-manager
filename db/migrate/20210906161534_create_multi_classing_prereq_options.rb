class CreateMultiClassingPrereqOptions < ActiveRecord::Migration[6.1]
  def change
    create_table :multi_classing_prereq_options do |t|
      t.references :multi_classing, null: false, foreign_key: true
      t.integer :choose
      t.string :type

      t.timestamps
    end
  end
end
