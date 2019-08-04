class AddSpellLevelTextToSpells < ActiveRecord::Migration[5.2]
  def change
    add_column :spells, :spell_level, :string
  end
end
