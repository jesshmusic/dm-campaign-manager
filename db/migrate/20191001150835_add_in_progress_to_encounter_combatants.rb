class AddInProgressToEncounterCombatants < ActiveRecord::Migration[5.2]
  def change
    add_column :encounter_combatants, :in_progress, :boolean, default: false
  end
end
