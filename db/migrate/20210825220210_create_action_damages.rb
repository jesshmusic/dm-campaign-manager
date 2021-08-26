class CreateActionDamages < ActiveRecord::Migration[6.1]
  def change
    create_table :action_damages do |t|
      t.string :damage_dice
      t.references :monster_action, foreign_key: true
      t.references :monster_legendary_action, foreign_key: true
      t.references :monster_special_ability, foreign_key: true
      t.timestamps
    end
  end
end
