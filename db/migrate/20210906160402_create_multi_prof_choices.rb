class CreateMultiProfChoices < ActiveRecord::Migration[6.1]
  def change
    create_table :multi_prof_choices do |t|
      t.references :prof, null: false, foreign_key: true
      t.references :multi_classing, null: false, foreign_key: true

      t.timestamps
    end
  end
end
