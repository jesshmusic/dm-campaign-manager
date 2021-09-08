class AddMultiClassingToProfChoice < ActiveRecord::Migration[6.1]
  def change
    add_reference :prof_choices, :multi_classing, optional: true
  end
end
