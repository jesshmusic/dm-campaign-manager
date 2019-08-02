class CreateMonsterSpecialAbilities < ActiveRecord::Migration[5.2]
  def change
    create_table :monster_special_abilities do |t|
      t.belongs_to :monster, foreign_key: true
      t.belongs_to :action, foreign_key: true

      t.timestamps
    end
  end
end
