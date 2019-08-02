class RemoveMonsterActionReferences < ActiveRecord::Migration[5.2]
  def change
    remove_column :actions, :monster_action_id
    remove_column :actions, :monster_legendary_action_id
    remove_column :actions, :monster_special_ability_id
  end
end
