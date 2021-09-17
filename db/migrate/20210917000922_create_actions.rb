class CreateActions < ActiveRecord::Migration[6.1]
  def change
    create_table :actions do |t|
      t.integer :attack_bonus
      t.string :desc
      t.string :name
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end

    create_table :senses do |t|
      t.string :unit
      t.integer :value
      t.string :name
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end

    create_table :speeds do |t|
      t.integer :value
      t.string :name
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end

    remove_column :monsters, :actions
    remove_column :monsters, :legendary_actions
    remove_column :monsters, :reactions
    remove_column :monsters, :special_abilities
    remove_column :monsters, :senses
    remove_column :monsters, :speed
  end
end
