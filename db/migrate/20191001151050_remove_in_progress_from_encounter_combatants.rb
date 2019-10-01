class RemoveInProgressFromEncounterCombatants < ActiveRecord::Migration[5.2]
  def change
    remove_column :encounter_combatants, :in_progress, :boolean
  end
end
