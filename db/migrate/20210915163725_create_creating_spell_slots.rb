class CreateCreatingSpellSlots < ActiveRecord::Migration[6.1]
  def change
    create_table :creating_spell_slots do |t|
      t.integer :sorcery_point_cost
      t.integer :spell_slot_level
      t.references :class_specific, null: false, foreign_key: true

      t.timestamps
    end
  end
end
