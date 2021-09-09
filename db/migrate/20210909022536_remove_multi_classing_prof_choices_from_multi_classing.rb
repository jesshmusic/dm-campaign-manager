class RemoveMultiClassingProfChoicesFromMultiClassing < ActiveRecord::Migration[6.1]
  def change
    drop_table :multi_prof_choices
  end
end
