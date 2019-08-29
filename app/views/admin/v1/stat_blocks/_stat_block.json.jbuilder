# frozen_string_literal: true
json.key_format! camelize: :lower

json.extract! stat_block, :armor_class, :strength, :dexterity, :constitution, :intelligence,
              :wisdom, :charisma, :hit_dice_modifier, :hit_dice_number, :hit_dice_value, :hit_points,
              :hit_points_current, :initiative, :speed
json.hit_dice stat_block.hit_dice
