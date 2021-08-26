class CreateProficiency < ActiveRecord::Migration[6.1]
  def change
    create_join_table :races, :profs do |t|
      t.index [:race_id, :prof_id]
    end
    create_table :monster_proficiencies do |t|
      t.belongs_to :monster
      t.belongs_to :prof
      t.integer :value
      t.timestamps
    end
  end
end
