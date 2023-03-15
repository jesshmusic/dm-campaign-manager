class RulesChangeRuleIdToParentId < ActiveRecord::Migration[6.1]
  def change
    remove_reference :rules, :rule
    add_reference :rules, :parent
  end
end
