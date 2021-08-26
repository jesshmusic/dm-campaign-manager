class RemoveMonsterIdFromConditions < ActiveRecord::Migration[6.1]
  def change
    remove_reference :conditions, :monster
  end
end
