class AddTypeToActions < ActiveRecord::Migration[6.1]
  def change
    add_column :actions, :type, :string

    drop_table :legendary_actions
    drop_table :reactions
    drop_table :special_abilities
  end
end
