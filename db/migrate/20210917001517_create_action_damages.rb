class CreateActionDamages < ActiveRecord::Migration[6.1]
  def change
    create_table :action_damages do |t|
      t.integer :dice_count
      t.integer :dice_value
      t.integer :damage_bonus
      t.references :action, null: false, foreign_key: true
      t.string :damage_type

      t.timestamps
    end
  end
end
