# == Schema Information
#
# Table name: foundry_map_taggings
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  foundry_map_id     :bigint           not null
#  foundry_map_tag_id :bigint           not null
#

require 'rails_helper'

RSpec.describe FoundryMapTagging, type: :model do
  let(:foundry_map) { create(:foundry_map) }
  let(:foundry_map_tag) { create(:foundry_map_tag) }
  let(:foundry_map_tagging) do
    FoundryMapTagging.create(foundry_map: foundry_map, foundry_map_tag: foundry_map_tag)
  end

  describe 'associations' do
    it { should belong_to(:foundry_map) }
    it { should belong_to(:foundry_map_tag) }
  end

  describe 'validations' do
    subject { foundry_map_tagging }

    it {
      should validate_uniqueness_of(:foundry_map_id)
        .scoped_to(:foundry_map_tag_id)
    }
  end

  describe 'uniqueness constraint' do
    it 'prevents duplicate taggings for the same map and tag' do
      create(:foundry_map_tagging, foundry_map: foundry_map, foundry_map_tag: foundry_map_tag)

      duplicate_tagging = build(:foundry_map_tagging, foundry_map: foundry_map, foundry_map_tag: foundry_map_tag)

      expect(duplicate_tagging).not_to be_valid
      expect(duplicate_tagging.errors[:foundry_map_id]).to include('has already been taken')
    end

    it 'allows the same tag on different maps' do
      map1 = create(:foundry_map)
      map2 = create(:foundry_map)
      tag = create(:foundry_map_tag)

      tagging1 = create(:foundry_map_tagging, foundry_map: map1, foundry_map_tag: tag)
      tagging2 = build(:foundry_map_tagging, foundry_map: map2, foundry_map_tag: tag)

      expect(tagging2).to be_valid
    end

    it 'allows the same map with different tags' do
      map = create(:foundry_map)
      tag1 = create(:foundry_map_tag)
      tag2 = create(:foundry_map_tag)

      tagging1 = create(:foundry_map_tagging, foundry_map: map, foundry_map_tag: tag1)
      tagging2 = build(:foundry_map_tagging, foundry_map: map, foundry_map_tag: tag2)

      expect(tagging2).to be_valid
    end
  end

  describe 'factory' do
    it 'creates a valid tagging' do
      tagging = create(:foundry_map_tagging)
      expect(tagging).to be_valid
    end
  end
end
