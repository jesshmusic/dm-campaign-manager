class AddRelationsToActionDamages < ActiveRecord::Migration[6.1]
  def change
    remove_reference :action_damages, :action
    add_reference :action_damages, :action, optional: true
    add_reference :action_damages, :legendary_action, optional: true
    add_reference :action_damages, :reaction, optional: true
    add_reference :action_damages, :special_ability, optional: true
  end
end
