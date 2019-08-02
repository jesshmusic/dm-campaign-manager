class ChangeActionAssociations < ActiveRecord::Migration[5.2]
  def change
    drop_table :monster_actions
    drop_table :monster_legendary_actions
    drop_table :monster_special_abilities
    
    add_reference :actions, :monster_action, foreign_key: { to_table: :actions }
    add_reference :actions, :monster_legendary_action, foreign_key: { to_table: :actions }
    add_reference :actions, :monster_special_ability, foreign_key: { to_table: :actions }
  end
end
