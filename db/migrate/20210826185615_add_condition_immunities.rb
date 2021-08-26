class AddConditionImmunities < ActiveRecord::Migration[6.1]
  def change
    create_table :condition_immunities do |t|
      t.belongs_to :monster
      t.belongs_to :condition
      t.timestamps
    end
  end
end
