class CreateCharacters < ActiveRecord::Migration[5.2]
  def change
    drop_table :character_stats
    drop_table :player_characters

    create_table :characters do |t|
      t.string :character_type, null: false
      
      t.string :name, null: false
      t.text :description
      t.string :slug, null: false, index: true
      t.string :role
      
      t.integer :level
      t.integer :xp

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
      t.integer :hit_points_current

      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma
      
      t.integer :copper_pieces
      t.integer :silver_pieces
      t.integer :electrum_pieces
      t.integer :gold_pieces
      t.integer :platinum_pieces
      
      t.references :user, index: true
      t.references :campaign, index: true

      t.timestamps
    end
    
    add_reference :equipment_items, :character, index: true
    add_reference :skills, :character, index: true
    add_reference :treasures, :character, index: true
    remove_column :treasures, :monster_id
    add_column :treasures, :electrum_pieces, :integer
    
    create_table :character_magic_items do |t|
      t.references :magic_item, index: true
      t.references :character, index: true
    end
    
    create_table :character_spells do |t|
      t.references :spell, index: true
      t.references :character, index: true
    end
  end
end
