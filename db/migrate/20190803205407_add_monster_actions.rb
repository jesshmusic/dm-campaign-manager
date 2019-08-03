class AddMonsterActions < ActiveRecord::Migration[5.2]
  def change
    drop_table :monster_actions
    drop_table :monster_legendary_actions
    drop_table :monster_special_abilities
    
    create_table :monster_actions do |t|
      t.string :name
      t.text :description
      t.integer :attack_bonus
      t.integer :damage_bonus
      t.string :damage_dice
      t.belongs_to :monster, index: true

      t.timestamps
    end
    
    create_table :monster_legendary_actions do |t|
      t.string :name
      t.text :description
      t.integer :attack_bonus
      t.integer :damage_bonus
      t.string :damage_dice
      t.belongs_to :monster, index: true

      t.timestamps
    end
    
    create_table :monster_special_abilities do |t|
      t.string :name
      t.text :description
      t.integer :attack_bonus
      t.integer :damage_bonus
      t.string :damage_dice
      t.belongs_to :monster, index: true

      t.timestamps
    end
  end
end
