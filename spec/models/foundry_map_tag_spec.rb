require 'rails_helper'

RSpec.describe FoundryMapTag, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:foundry_map_tag)).to be_valid
    end
  end

  describe 'validations' do
    it 'requires name' do
      tag = build(:foundry_map_tag, name: nil)
      expect(tag).not_to be_valid
    end

    it 'is valid with name' do
      tag = build(:foundry_map_tag, name: 'Tavern')
      expect(tag).to be_valid
    end

    it 'requires unique name' do
      create(:foundry_map_tag, name: 'Dungeon', slug: 'dungeon')
      tag = build(:foundry_map_tag, name: 'Dungeon')
      expect(tag).not_to be_valid
    end

    it 'requires unique slug' do
      create(:foundry_map_tag, slug: 'forest')
      tag = build(:foundry_map_tag, slug: 'forest')
      expect(tag).not_to be_valid
    end
  end

  describe 'associations' do
    it 'has_many foundry_map_taggings' do
      tag = create(:foundry_map_tag)
      expect(tag).to respond_to(:foundry_map_taggings)
    end

    it 'has_many foundry_maps through foundry_map_taggings' do
      tag = create(:foundry_map_tag)
      expect(tag).to respond_to(:foundry_maps)
    end

    it 'can have multiple foundry_maps' do
      tag = create(:foundry_map_tag)
      map1 = create(:foundry_map)
      map2 = create(:foundry_map)
      tag.foundry_maps << map1
      tag.foundry_maps << map2

      expect(tag.foundry_maps.count).to eq(2)
      expect(tag.foundry_maps).to include(map1, map2)
    end
  end

  describe '#generate_slug' do
    it 'generates slug from name before validation' do
      tag = create(:foundry_map_tag, name: 'Forest Area', slug: nil)
      expect(tag.slug).to eq('forest-area')
    end

    it 'handles slug generation with uppercase' do
      tag = create(:foundry_map_tag, name: 'INDOOR', slug: nil)
      expect(tag.slug).to eq('indoor')
    end

    it 'handles slug generation with special characters' do
      tag = create(:foundry_map_tag, name: "Town's Market", slug: nil)
      expect(tag.slug).not_to include("'")
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      tag = create(:foundry_map_tag, name: 'Outdoor')
      expect(tag.name).to eq('Outdoor')
    end

    it 'has slug attribute' do
      tag = create(:foundry_map_tag, slug: 'custom-slug')
      expect(tag.slug).to eq('custom-slug')
    end

    it 'has created_at timestamp' do
      tag = create(:foundry_map_tag)
      expect(tag.created_at).not_to be_nil
    end

    it 'has updated_at timestamp' do
      tag = create(:foundry_map_tag)
      expect(tag.updated_at).not_to be_nil
    end
  end

  describe 'common tags' do
    it 'can create Tavern tag' do
      tag = create(:foundry_map_tag, name: 'Tavern')
      expect(tag.name).to eq('Tavern')
    end

    it 'can create Dungeon tag' do
      tag = create(:foundry_map_tag, name: 'Dungeon')
      expect(tag.name).to eq('Dungeon')
    end

    it 'can create Forest tag' do
      tag = create(:foundry_map_tag, name: 'Forest')
      expect(tag.name).to eq('Forest')
    end

    it 'can create Cave tag' do
      tag = create(:foundry_map_tag, name: 'Cave')
      expect(tag.name).to eq('Cave')
    end

    it 'can create Town tag' do
      tag = create(:foundry_map_tag, name: 'Town')
      expect(tag.name).to eq('Town')
    end

    it 'can create Castle tag' do
      tag = create(:foundry_map_tag, name: 'Castle')
      expect(tag.name).to eq('Castle')
    end

    it 'can create Indoor tag' do
      tag = create(:foundry_map_tag, name: 'Indoor')
      expect(tag.name).to eq('Indoor')
    end

    it 'can create Outdoor tag' do
      tag = create(:foundry_map_tag, name: 'Outdoor')
      expect(tag.name).to eq('Outdoor')
    end

    it 'can create Battle tag' do
      tag = create(:foundry_map_tag, name: 'Battle')
      expect(tag.name).to eq('Battle')
    end

    it 'can create House tag' do
      tag = create(:foundry_map_tag, name: 'House')
      expect(tag.name).to eq('House')
    end
  end

  describe 'tag persistence' do
    it 'persists tag attributes' do
      tag = create(:foundry_map_tag, name: 'Test Tag', slug: 'test-tag')

      reloaded = FoundryMapTag.find(tag.id)
      expect(reloaded.name).to eq('Test Tag')
      expect(reloaded.slug).to eq('test-tag')
    end
  end

  describe 'tag querying' do
    it 'finds tag by name' do
      tag = create(:foundry_map_tag, name: 'Unique Tag')
      found = FoundryMapTag.find_by(name: 'Unique Tag')

      expect(found).to eq(tag)
    end

    it 'finds tag by slug' do
      tag = create(:foundry_map_tag, slug: 'unique-slug')
      found = FoundryMapTag.find_by(slug: 'unique-slug')

      expect(found).to eq(tag)
    end
  end
end
