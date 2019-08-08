class CreateCharacterStats < ActiveRecord::Migration[5.2]
  def change
    create_table :character_stats do |t|
      t.integer :level
      t.string :alignment
      t.string :race
      t.integer :initiative
      t.integer :proficiency
      t.string :speed
      t.string :languages
      
      t.string :spell_ability
      t.integer :spell_save_dc
      t.integer :spell_attack_bonus

      t.integer :armor_class
      t.integer :hit_points
      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma

      t.timestamps
    end
  end
end
