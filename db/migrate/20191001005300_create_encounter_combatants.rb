class CreateEncounterCombatants < ActiveRecord::Migration[5.2]
  def change
    create_table :encounter_combatants do |t|
      t.references :encounter, foreign_key: true
      t.references :character, foreign_key: true
      t.references :monster, foreign_key: true
      t.integer :current_hit_points, default: 0
      t.integer :initiative_roll, default: 0
      t.integer :combat_order_number, default: 0
      t.text :notes, default: ''

      t.timestamps
    end
  end
end
