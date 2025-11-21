require 'rails_helper'

RSpec.describe MagicItem, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:magic_item)).to be_valid
    end
  end

  describe '#category' do
    it 'returns Magic Item' do
      magic_item = build(:magic_item)
      expect(magic_item.category).to eq('Magic Item')
    end
  end

  describe 'inheritance' do
    it 'inherits from Item' do
      expect(MagicItem.superclass).to eq(Item)
    end
  end

  describe 'attributes' do
    it 'has magic item-specific attributes' do
      magic_item = create(:magic_item,
                         name: 'Ring of Protection',
                         rarity: 'rare',
                         requires_attunement: 'yes',
                         magic_item_type: 'ring')

      expect(magic_item.name).to eq('Ring of Protection')
      expect(magic_item.rarity).to eq('rare')
      expect(magic_item.requires_attunement).to eq('yes')
      expect(magic_item.magic_item_type).to eq('ring')
    end

    it 'stores description as array' do
      magic_item = create(:magic_item, desc: ['This ring grants a +1 bonus to AC.'])
      expect(magic_item.desc).to be_an(Array)
      expect(magic_item.desc.first).to include('ring')
    end
  end

  describe '.create_magic_item_from_old_magic_items' do
    let(:old_magic_item_data) do
      {
        name: 'Wand of Fireballs',
        desc: 'This wand has 7 charges.',
        rarity: 'rare',
        requires_attunement: 'requires attunement by a spellcaster',
        type: 'wand'
      }
    end

    it 'creates a new magic item from old format' do
      expect {
        MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      }.to change(MagicItem, :count).by(1)
    end

    it 'sets the name correctly' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(name: 'Wand of Fireballs')

      expect(item).to be_present
      expect(item.name).to eq('Wand of Fireballs')
    end

    it 'generates slug from name' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(slug: 'wand-of-fireballs')

      expect(item).to be_present
    end

    it 'stores description as array' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(name: 'Wand of Fireballs')

      expect(item.desc).to be_an(Array)
      expect(item.desc.first).to eq('This wand has 7 charges.')
    end

    it 'sets rarity' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(name: 'Wand of Fireballs')

      expect(item.rarity).to eq('rare')
    end

    it 'sets requires_attunement' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(name: 'Wand of Fireballs')

      expect(item.requires_attunement).to eq('requires attunement by a spellcaster')
    end

    it 'sets magic_item_type' do
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      item = MagicItem.find_by(name: 'Wand of Fireballs')

      expect(item.magic_item_type).to eq('wand')
    end

    it 'finds existing item instead of creating duplicate' do
      # Create first item
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)

      # Try to create the same item again
      expect {
        MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)
      }.not_to change(MagicItem, :count)
    end

    it 'updates existing item when found' do
      # Create initial item
      MagicItem.create_magic_item_from_old_magic_items(old_magic_item_data)

      # Update with new rarity
      updated_data = old_magic_item_data.merge(rarity: 'very rare')
      MagicItem.create_magic_item_from_old_magic_items(updated_data)

      item = MagicItem.find_by(name: 'Wand of Fireballs')
      expect(item.rarity).to eq('very rare')
    end
  end

  describe 'different rarity levels' do
    it 'handles common rarity' do
      item = create(:magic_item, rarity: 'common')
      expect(item.rarity).to eq('common')
    end

    it 'handles uncommon rarity' do
      item = create(:magic_item, rarity: 'uncommon')
      expect(item.rarity).to eq('uncommon')
    end

    it 'handles rare rarity' do
      item = create(:magic_item, rarity: 'rare')
      expect(item.rarity).to eq('rare')
    end

    it 'handles very rare rarity' do
      item = create(:magic_item, rarity: 'very rare')
      expect(item.rarity).to eq('very rare')
    end

    it 'handles legendary rarity' do
      item = create(:magic_item, rarity: 'legendary')
      expect(item.rarity).to eq('legendary')
    end
  end
end
