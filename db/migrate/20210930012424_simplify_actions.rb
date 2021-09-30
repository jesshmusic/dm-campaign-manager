class SimplifyActions < ActiveRecord::Migration[6.1]
  def change
    drop_table :multi_action_attacks
    drop_table :multiattack_actions
    remove_column :actions, :attack_bonus
    remove_column :actions, :dc_ability
    remove_column :actions, :dc_success_type
    remove_column :actions, :dc_value
    remove_column :actions, :usage_dice
    remove_column :actions, :usage_min_value
    remove_column :actions, :usage_type
    drop_table :action_damages
  end
end
