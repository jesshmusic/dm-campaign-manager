class AddRuleToRules < ActiveRecord::Migration[6.1]
  def change
    add_reference :rules, :rule, optional: true
  end
end
