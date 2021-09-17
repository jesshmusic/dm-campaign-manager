require 'rails_helper'

RSpec.describe DndRules do
  context 'Dice Parser' do
    it 'should handle basic positive modifier dice strings with no spaces' do
      expected = {
        hit_dice_number: 1,
        hit_dice_value: 8,
        hit_dice_modifier: 2
      }

      expect(DndRules.parse_dice_string('1d8+2')).to eq(expected)
    end

    it 'should handle basic negative modifier dice strings with no spaces' do
      expected = {
        hit_dice_number: 1,
        hit_dice_value: 8,
        hit_dice_modifier: -2
      }

      expect(DndRules.parse_dice_string('1d8-2')).to eq(expected)
    end

    it 'should handle basic positive modifier dice strings with spaces' do
      expected = {
        hit_dice_number: 1,
        hit_dice_value: 8,
        hit_dice_modifier: 2
      }

      expect(DndRules.parse_dice_string('1d8 + 2')).to eq(expected)
    end

    it 'should handle basic negative modifier dice strings with spaces' do
      expected = {
        hit_dice_number: 1,
        hit_dice_value: 8,
        hit_dice_modifier: -2
      }

      expect(DndRules.parse_dice_string('1d8 - 2')).to eq(expected)
    end

    it 'should handle dice strings with no modifier' do
      expected = {
        hit_dice_number: 1,
        hit_dice_value: 8,
        hit_dice_modifier: 0
      }

      expect(DndRules.parse_dice_string('1d8')).to eq(expected)
    end

    it 'should handle double digit dice strings' do
      expected = {
        hit_dice_number: 10,
        hit_dice_value: 12,
        hit_dice_modifier: 12
      }

      expect(DndRules.parse_dice_string('10d12 + 12')).to eq(expected)
    end

    it 'should handle triple digit dice strings' do
      expected = {
        hit_dice_number: 2,
        hit_dice_value: 100,
        hit_dice_modifier: -3
      }

      expect(DndRules.parse_dice_string('2d100-3')).to eq(expected)
    end
  end
end
