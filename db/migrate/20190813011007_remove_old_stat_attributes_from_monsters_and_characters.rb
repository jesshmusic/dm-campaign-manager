# frozen_string_literal: true

class RemoveOldStatAttributesFromMonstersAndCharacters < ActiveRecord::Migration[5.2]
  def change
    remove_column :characters, :armor_class
    remove_column :characters, :charisma
    remove_column :characters, :constitution
    remove_column :characters, :dexterity
    remove_column :characters, :hit_dice_number
    remove_column :characters, :hit_dice_value
    remove_column :characters, :hit_points
    remove_column :characters, :hit_points_current
    remove_column :characters, :initiative
    remove_column :characters, :intelligence
    remove_column :characters, :proficiency
    remove_column :characters, :speed
    remove_column :characters, :strength
    remove_column :characters, :wisdom

    remove_column :monsters, :armor_class
    remove_column :monsters, :charisma
    remove_column :monsters, :constitution
    remove_column :monsters, :dexterity
    remove_column :monsters, :hit_dice
    remove_column :monsters, :hit_points
    remove_column :monsters, :intelligence
    remove_column :monsters, :speed
    remove_column :monsters, :strength
    remove_column :monsters, :wisdom
  end
end
