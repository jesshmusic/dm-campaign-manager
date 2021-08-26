class RemoveMonsterActions < ActiveRecord::Migration[6.1]
  def change
    drop_table :monster_actions

    add_column :monsters, :actions, :jsonb, array: true, default: []
    add_column :monsters, :legendary_actions, :jsonb, array: true, default: []
    add_column :monsters, :special_abilities, :jsonb, array: true, default: []
    add_column :monsters, :reactions, :jsonb, array: true, default: []
  end
end
