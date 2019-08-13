# frozen_string_literal: true

class SetDefaultsForStatBlocks < ActiveRecord::Migration[5.2]
  def change
    change_column :stat_blocks, :armor_class, :integer, default: 10
    change_column :stat_blocks, :charisma, :integer, null: false, default: 10
    change_column :stat_blocks, :constitution, :integer, null: false, default: 10
    change_column :stat_blocks, :dexterity, :integer, null: false, default: 10
    change_column :stat_blocks, :hit_dice_number, :integer, null: false, default: 1
    change_column :stat_blocks, :hit_dice_value, :integer, null: false, default: 8
    change_column :stat_blocks, :hit_points, :integer, null: false, default: 8
    change_column :stat_blocks, :hit_points_current, :integer, null: false, default: 8
    change_column :stat_blocks, :initiative, :integer, null: false, default: 0
    change_column :stat_blocks, :intelligence, :integer, null: false, default: 10
    change_column :stat_blocks, :proficiency, :integer, null: false, default: 2
    change_column :stat_blocks, :speed, :string, null: false, default: '30 feet'
    change_column :stat_blocks, :strength, :integer, null: false, default: 10
    change_column :stat_blocks, :wisdom, :integer, null: false, default: 10
  end
end
