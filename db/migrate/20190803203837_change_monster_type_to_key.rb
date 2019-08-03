class ChangeMonsterTypeToKey < ActiveRecord::Migration[5.2]
  def change
    rename_column :monsters, :type, :monster_type
    rename_column :monsters, :subtype, :monster_subtype
  end
end
