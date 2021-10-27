class ChangeMonsterResistancesToStringArrays < ActiveRecord::Migration[6.1]
  def change
    drop_table :monster_immunities

    add_column :monsters, :condition_immunities, :string, array: true, default: []
    add_column :monsters, :damage_immunities, :string, array: true, default: []
    add_column :monsters, :damage_resistances, :string, array: true, default: []
    add_column :monsters, :damage_vulnerabilities, :string, array: true, default: []
  end
end
