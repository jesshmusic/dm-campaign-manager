class CreateMultiActionAttacks < ActiveRecord::Migration[6.1]
  def change
    create_table :multi_action_attacks do |t|
      t.string :name
      t.integer :num_attacks
      t.references :multiattack_action, null: false, foreign_key: true

      t.timestamps
    end
  end
end
