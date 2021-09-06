class CreateAbilityScores < ActiveRecord::Migration[6.1]
  def change
    create_table :ability_scores do |t|
      t.string :slug
      t.string :name
      t.string :full_name
      t.string :desc, array: true, default: []

      t.timestamps
    end
  end
end
