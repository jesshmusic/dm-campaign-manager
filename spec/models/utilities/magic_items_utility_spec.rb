require 'rails_helper'

RSpec.describe MagicItemsUtility, type: :model do
  describe '.cost_for_rarity' do
    it 'returns 100 for common items' do
      expect(MagicItemsUtility.cost_for_rarity('common')).to eq(100)
    end

    it 'returns 500 for uncommon items' do
      expect(MagicItemsUtility.cost_for_rarity('uncommon')).to eq(500)
    end

    it 'returns 5000 for rare items' do
      expect(MagicItemsUtility.cost_for_rarity('rare')).to eq(5000)
    end

    it 'returns 50000 for very rare items' do
      expect(MagicItemsUtility.cost_for_rarity('very rare')).to eq(50000)
    end

    it 'returns 75000 for legendary items' do
      expect(MagicItemsUtility.cost_for_rarity('legendary')).to eq(75000)
    end

    it 'returns 500 as default for unknown rarity' do
      expect(MagicItemsUtility.cost_for_rarity('unknown')).to eq(500)
    end

    it 'returns 500 for nil rarity' do
      expect(MagicItemsUtility.cost_for_rarity(nil)).to eq(500)
    end

    it 'returns 500 for empty string' do
      expect(MagicItemsUtility.cost_for_rarity('')).to eq(500)
    end
  end
end
