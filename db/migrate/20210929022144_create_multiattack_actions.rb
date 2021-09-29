class CreateMultiattackActions < ActiveRecord::Migration[6.1]
  def change
    create_table :multiattack_actions do |t|
      t.string :name
      t.string :desc
      t.references :monster, null: false, foreign_key: true
      t.integer :total_attacks

      t.timestamps
    end
  end
end
