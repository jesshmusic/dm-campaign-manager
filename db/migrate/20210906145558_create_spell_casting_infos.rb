class CreateSpellCastingInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :spell_casting_infos do |t|
      t.string :desc
      t.string :name
      t.references :spell_casting, null: false, foreign_key: true

      t.timestamps
    end
  end
end
