# frozen_string_literal: true

class CreateStatBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :stat_blocks do |t|
      t.references :character, optional: true
      t.references :monster, optional: true
      t.integer :armor_class
      t.integer :charisma
      t.integer :constitution
      t.integer :dexterity
      t.integer :hit_dice_number
      t.integer :hit_dice_value
      t.integer :hit_points
      t.integer :hit_points_current
      t.integer :initiative
      t.integer :intelligence
      t.integer :proficiency
      t.string :speed
      t.integer :strength
      t.integer :wisdom

      t.timestamps
    end

    remove_reference :characters, :campaign
  end
end
