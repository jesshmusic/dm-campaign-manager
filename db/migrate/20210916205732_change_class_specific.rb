class ChangeClassSpecific < ActiveRecord::Migration[6.1]
  def change
    drop_table :martial_arts
    drop_table :sneak_attacks
    drop_table :class_specific_spell_slots
    drop_table :class_specifics
    create_table :class_specifics do |t|
      t.references :dnd_class_level, null: false, foreign_key: true
      t.string :name
      t.string :index
      t.string :value

      t.timestamps
    end

    create_table :class_specific_spell_slots do |t|
      t.integer :sorcery_point_cost
      t.integer :spell_slot_level
      t.references :class_specific, null: false, foreign_key: true

      t.timestamps
    end
  end
end
