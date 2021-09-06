class CreateAbilityScoreDndClasses < ActiveRecord::Migration[6.1]
  def change
    create_table :ability_score_dnd_classes do |t|
      t.references :dnd_class, null: false, foreign_key: true
      t.references :ability_score, null: false, foreign_key: true

      t.timestamps
    end
  end
end
