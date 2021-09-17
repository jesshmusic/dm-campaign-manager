class CreateLegendaryActions < ActiveRecord::Migration[6.1]
  def change
    create_table :legendary_actions do |t|
      t.integer :attack_bonus
      t.string :dc_type
      t.string :dc_value
      t.string :desc
      t.string :name
      t.string :success_type
      t.string :usage_dice
      t.integer :usage_min_value
      t.string :usage_type
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
    create_table :reactions do |t|
      t.integer :attack_bonus
      t.string :dc_type
      t.string :dc_value
      t.string :desc
      t.string :name
      t.string :success_type
      t.string :usage_dice
      t.integer :usage_min_value
      t.string :usage_type
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
    create_table :special_abilities do |t|
      t.integer :attack_bonus
      t.string :dc_type
      t.string :dc_value
      t.string :desc
      t.string :name
      t.string :success_type
      t.string :usage_dice
      t.integer :usage_min_value
      t.string :usage_type
      t.references :monster, null: false, foreign_key: true

      t.timestamps
    end
  end
end
