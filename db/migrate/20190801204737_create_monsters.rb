class CreateMonsters < ActiveRecord::Migration[5.2]
  def change
    create_table :monsters do |t|
      t.string :name
      t.string :size
      t.string :type
      t.string :subtype
      t.string :alignment
      t.integer :armor_class
      t.integer :hit_points
      t.string :hit_dice
      t.string :speed
      
      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma
      t.integer :strength_save
      t.integer :dexterity_save
      t.integer :constitution_save
      t.integer :intelligence_save
      t.integer :wisdom_save
      t.integer :charisma_save
      
      t.string :damage_vulnerabilities
      t.string :damage_resistances
      t.string :damage_immunities
      t.string :condition_immunities
      t.string :senses
      t.string :languages
      t.integer :challenge_rating
      t.string :api_url

      t.timestamps
    end
    
    create_table :monster_actions do |t|
      t.belongs_to :monster, index: true
      t.belongs_to :action, index: true
      t.timestamps
    end
    
    create_table :monster_special_abilities do |t|
      t.belongs_to :monster, index: true
      t.belongs_to :action, index: true
      t.timestamps
    end
    
    create_table :monster_legendary_actions do |t|
      t.belongs_to :monster, index: true
      t.belongs_to :action, index: true
      t.timestamps
    end
  end
end
