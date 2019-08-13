# frozen_string_literal: true

class AddHitDiceModifierToStatBlocks < ActiveRecord::Migration[5.2]
  def change
    add_column :stat_blocks, :hit_dice_modifier, :integer, default: 0
  end
end
