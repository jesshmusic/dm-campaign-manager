class FixSpellCastingInfo < ActiveRecord::Migration[6.1]
  def change
    remove_column :spell_casting_infos, :desc
    add_column :spell_casting_infos, :desc, :string, array: true, default: []
  end
end
