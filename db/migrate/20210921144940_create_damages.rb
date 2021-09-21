class CreateDamages < ActiveRecord::Migration[6.1]
  def change
    create_table :damages do |t|
      t.string :damage_type
      t.string :damage_dice
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    create_table :armor_classes do |t|
      t.integer :ac_base
      t.boolean :has_dex_bonus
      t.integer :max_dex_bonus
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    create_table :item_ranges do |t|
      t.integer :long
      t.integer :normal
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    create_table :item_throw_ranges do |t|
      t.integer :long
      t.integer :normal
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    create_table :content_items do |t|
      t.references :item, null: false, foreign_key: true
      t.references :content_item, null: false, foreign_key: true

      t.timestamps
    end

    create_table :two_handed_damages do |t|
      t.string :damage_type
      t.string :damage_dice
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end

    remove_column :items, :contents
    remove_column :items, :armor_class
    remove_column :items, :damage
    remove_column :items, :range
    remove_column :items, :speed
    remove_column :items, :throw_range
    remove_column :items, :two_handed_damage
    add_column :items, :speed, :string
  end
end
