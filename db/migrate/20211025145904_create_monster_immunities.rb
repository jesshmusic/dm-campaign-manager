class CreateMonsterImmunities < ActiveRecord::Migration[6.1]
  def change
    create_table :monster_immunities do |t|
      t.string :name
      t.string :type
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end

    drop_table :condition_immunities
    drop_table :damage_immunities
    drop_table :damage_resistances
    drop_table :damage_vulnerabilities
  end
end
