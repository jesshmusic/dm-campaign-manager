class CreateClassSpecificDices < ActiveRecord::Migration[6.1]
  def change
    create_table :class_specific_dices do |t|
      t.integer :dice_count
      t.integer :dice_value
      t.references :class_specific, null: false, foreign_key: true

      t.timestamps
    end
  end
end
