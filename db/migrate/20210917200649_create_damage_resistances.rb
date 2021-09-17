class CreateDamageResistances < ActiveRecord::Migration[6.1]
  def change
    create_table :damage_resistances do |t|
      t.string :name
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
  end
end
