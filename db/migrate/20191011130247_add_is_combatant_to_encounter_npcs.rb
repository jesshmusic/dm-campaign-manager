class AddIsCombatantToEncounterNpcs < ActiveRecord::Migration[5.2]
  def change
    add_column :encounter_npcs, :is_combatant, :boolean, default: false, null: false
  end
end
