class MakeMonsterOptional < ActiveRecord::Migration[6.1]
  def change
    change_column_null(:actions, :monster_id, true)
  end
end
