class CreateClassSpellcastings < ActiveRecord::Migration[6.1]
  def change
    create_table :class_spellcastings do |t|
      t.integer :cantrips_known
      t.integer :spells_known
      t.integer :spell_slots_level_1
      t.integer :spell_slots_level_2
      t.integer :spell_slots_level_3
      t.integer :spell_slots_level_4
      t.integer :spell_slots_level_5
      t.integer :spell_slots_level_6
      t.integer :spell_slots_level_7
      t.integer :spell_slots_level_8
      t.integer :spell_slots_level_9
      t.references :dnd_class_level, null: false, foreign_key: true

      t.timestamps
    end
  end
end
