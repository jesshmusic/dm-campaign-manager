# frozen_string_literal: true

class SetDefaultsForCharacters < ActiveRecord::Migration[5.2]
  def change
    change_column :characters, :armor_class, :integer, default: 10
    change_column :characters, :character_type, :string, null: false, default: 'pc'
    change_column :characters, :charisma, :integer, null: false, default: 10
    change_column :characters, :constitution, :integer, null: false, default: 10
    change_column :characters, :copper_pieces, :integer, default: 0
    change_column :characters, :description, :text, default: "Enter this character's backstory, history, or notes here."
    change_column :characters, :dexterity, :integer, null: false, default: 10
    change_column :characters, :electrum_pieces, :integer, default: 0
    change_column :characters, :gold_pieces, :integer, default: 0
    change_column :characters, :hit_points, :integer, null: false, default: 8
    change_column :characters, :hit_points_current, :integer, null: false, default: 8
    change_column :characters, :initiative, :integer, null: false, default: 0
    change_column :characters, :intelligence, :integer, null: false, default: 10
    change_column :characters, :languages, :string, default: 'Common'
    change_column :characters, :level, :integer, null: false, default: 1
    change_column :characters, :platinum_pieces, :integer
    change_column :characters, :proficiency, :integer, null: false, default: 2
    change_column :characters, :race, :string, null: false, default: 'Human'
    change_column :characters, :role, :string, default: 'Player Character'
    change_column :characters, :silver_pieces, :integer, null: false, default: 0
    change_column :characters, :speed, :string, null: false, default: '30 feet'
    change_column :characters, :spell_ability, :string, default: 'Intelligence'
    change_column :characters, :spell_attack_bonus, :integer, default: 0
    change_column :characters, :spell_save_dc, :integer, default: 8
    change_column :characters, :strength, :integer, null: false, default: 10
    change_column :characters, :wisdom, :integer, null: false, default: 10
    change_column :characters, :xp, :integer, null: false, default: 0
    add_column :characters, :background, :string, default: 'Acolyte'
    add_column :characters, :hit_dice_number, :integer, null: false, default: 1
    add_column :characters, :hit_dice_value, :integer, null: false, default: 8
    add_column :character_spells, :is_prepared, :boolean, null: false, default: false

    create_table :character_actions do |t|
      t.string :name, default: 'New Action'
      t.text :description, default: ''
      t.integer :attack_bonus
      t.integer :damage_bonus
      t.string :damage_dice
      t.belongs_to :character, index: true

      t.timestamps
    end
  end
end
