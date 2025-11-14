# == Schema Information
#
# Table name: foundry_map_tags
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe FoundryMapTag, type: :model do
  let(:foundry_map_tag) { create(:foundry_map_tag) }

  describe 'associations' do
    it { should have_many(:foundry_map_taggings).dependent(:destroy) }
    it { should have_many(:foundry_maps).through(:foundry_map_taggings) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name) }
    it { should validate_presence_of(:slug) }
    it { should validate_uniqueness_of(:slug) }
  end

  describe 'callbacks' do
    describe 'before_validation' do
      context 'when slug is blank and name is present' do
        it 'generates slug from name' do
          tag = build(:foundry_map_tag, name: 'Haunted Castle', slug: nil)
          tag.valid?
          expect(tag.slug).to eq('haunted-castle')
        end

        it 'parameterizes name correctly' do
          tag = build(:foundry_map_tag, name: 'Forest & Rivers', slug: nil)
          tag.valid?
          expect(tag.slug).to eq('forest-rivers')
        end

        it 'handles names with special characters' do
          tag = build(:foundry_map_tag, name: 'Dragon's Lair!!!', slug: nil)
          tag.valid?
          expect(tag.slug).to eq('dragon-s-lair')
        end
      end

      context 'when slug is already set' do
        it 'does not override existing slug' do
          tag = build(:foundry_map_tag, name: 'Forest', slug: 'custom-slug')
          tag.valid?
          expect(tag.slug).to eq('custom-slug')
        end
      end
    end
  end

  describe 'scopes' do
    describe '.ordered' do
      let!(:tag_c) { create(:foundry_map_tag, name: 'Cave') }
      let!(:tag_a) { create(:foundry_map_tag, name: 'Arena') }
      let!(:tag_b) { create(:foundry_map_tag, name: 'Bridge') }

      it 'returns tags ordered by name' do
        expect(FoundryMapTag.ordered.pluck(:name)).to eq(['Arena', 'Bridge', 'Cave'])
      end
    end
  end

  describe '#as_json_for_api' do
    let(:tag) { create(:foundry_map_tag, name: 'Dungeon', slug: 'dungeon') }
    let!(:published_map) { create(:foundry_map, :with_tags, published: true, foundry_map_tags: [tag]) }
    let!(:unpublished_map) { create(:foundry_map, :unpublished, foundry_map_tags: [tag]) }

    it 'returns a hash with expected keys' do
      json = tag.as_json_for_api

      expect(json).to include(:value, :label, :count)
    end

    it 'uses slug as value' do
      expect(tag.as_json_for_api[:value]).to eq('dungeon')
    end

    it 'uses name as label' do
      expect(tag.as_json_for_api[:label]).to eq('Dungeon')
    end

    it 'counts only published maps' do
      expect(tag.as_json_for_api[:count]).to eq(1)
    end

    it 'returns 0 count when no published maps' do
      new_tag = create(:foundry_map_tag)
      expect(new_tag.as_json_for_api[:count]).to eq(0)
    end
  end

  describe 'factory' do
    it 'creates a valid tag' do
      expect(foundry_map_tag).to be_valid
    end

    it 'creates unique names and slugs' do
      tag1 = create(:foundry_map_tag)
      tag2 = create(:foundry_map_tag)

      expect(tag1.name).not_to eq(tag2.name)
      expect(tag1.slug).not_to eq(tag2.slug)
    end

    describe 'traits' do
      it 'creates dungeon tag' do
        tag = create(:foundry_map_tag, :dungeon)
        expect(tag.name).to eq('Dungeon')
        expect(tag.slug).to eq('dungeon')
      end

      it 'creates cave tag' do
        tag = create(:foundry_map_tag, :cave)
        expect(tag.name).to eq('Cave')
        expect(tag.slug).to eq('cave')
      end

      it 'creates forest tag' do
        tag = create(:foundry_map_tag, :forest)
        expect(tag.name).to eq('Forest')
        expect(tag.slug).to eq('forest')
      end

      it 'creates city tag' do
        tag = create(:foundry_map_tag, :city)
        expect(tag.name).to eq('City')
        expect(tag.slug).to eq('city')
      end

      it 'creates tavern tag' do
        tag = create(:foundry_map_tag, :tavern)
        expect(tag.name).to eq('Tavern')
        expect(tag.slug).to eq('tavern')
      end
    end
  end
end
