class AddIdsToClassSpecificDice < ActiveRecord::Migration[6.1]
  def change
    # drop_table :class_specific_dices
    create_table :sneak_attacks do |t|
      t.integer :dice_count
      t.integer :dice_value
      t.references :class_specific, null: false, foreign_key: true

      t.timestamps
    end

    create_table :martial_arts do |t|
      t.integer :dice_count
      t.integer :dice_value
      t.references :class_specific, null: false, foreign_key: true

      t.timestamps
    end
  end
end
