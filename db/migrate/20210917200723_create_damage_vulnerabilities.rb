class CreateDamageVulnerabilities < ActiveRecord::Migration[6.1]
  def change
    create_table :damage_vulnerabilities do |t|
      t.string :name
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end

    remove_column :monsters, :damage_vulnerabilities
    remove_column :monsters, :damage_immunities
    remove_column :monsters, :damage_resistances
  end
end
