class AddOptionsToMonsterActions < ActiveRecord::Migration[6.1]
  def change
    add_column :monster_actions, :options, :jsonb
  end
end
