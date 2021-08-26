class CreateDamageTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :damage_types do |t|
      t.string :name
      t.string :index
      t.references :action_damage, null: false, foreign_key: true

      t.timestamps
    end
  end
end
