class RenameCreatingSpellSlotsToClassSpecificSpellSlots < ActiveRecord::Migration[6.1]
  def change
    rename_table :creating_spell_slots, :class_specific_spell_slots
  end
end
