class AddNameToEncounterCombatants < ActiveRecord::Migration[5.2]
  def change
    add_column :encounter_combatants, :name, :string
  end
end
