class CreateSpellCastingAbilities < ActiveRecord::Migration[6.1]
  def change
    create_table :spell_casting_abilities do |t|
      t.references :spell_casting, null: false, foreign_key: true
      t.references :ability_score, null: false, foreign_key: true

      t.timestamps
    end
  end
end
