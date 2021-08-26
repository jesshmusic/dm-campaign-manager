class SimplifyMonsterActions < ActiveRecord::Migration[6.1]
  def change
    drop_table :damage_types
    drop_table :action_damages
    drop_table :monster_legendary_actions
    drop_table :monster_special_abilities
    drop_table :reactions
    drop_table :senses
    drop_table :speeds
    drop_table :skills

    add_column :monsters, :senses, :jsonb
    add_column :monsters, :speed, :jsonb

    add_column :monster_actions, :dc, :jsonb
    add_column :monster_actions, :damage, :jsonb, array: true, default: []
    add_column :monster_actions, :usage, :jsonb
  end
end
