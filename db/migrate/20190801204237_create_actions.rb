class CreateActions < ActiveRecord::Migration[5.2]
  def change
    create_table :actions do |t|
      t.string :name
      t.text :description
      t.integer :attack_bonus
      t.integer :damage_bonus
      t.string :damage_dice

      t.timestamps
    end
  end
end
