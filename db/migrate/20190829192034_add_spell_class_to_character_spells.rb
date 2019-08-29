class AddSpellClassToCharacterSpells < ActiveRecord::Migration[5.2]
  def change
    add_column :character_spells, :spell_class, :string
  end
end
