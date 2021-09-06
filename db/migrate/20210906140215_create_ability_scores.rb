class CreateAbilityScores < ActiveRecord::Migration[6.1]
  def change
    create_table :ability_scores do |t|
      t.string :desc, array: true, default: []
      t.string :full_name
      t.string :name
      t.string :slug

      t.timestamps
    end
  end
end
