class CreateSpellCastings < ActiveRecord::Migration[6.1]
  def change
    create_table :spell_castings do |t|
      t.integer :level
      t.references :dnd_class, null: false, foreign_key: true

      t.timestamps
    end
  end
end
