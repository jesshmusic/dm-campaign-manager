require 'rails_helper'

RSpec.describe CampaignReference, type: :model do
  let(:campaign) { create(:campaign) }

  it 'has a valid factory' do
    expect(build(:campaign_reference)).to be_valid
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_inclusion_of(:book).in_array(CampaignReference::BOOKS.keys) }
    it { is_expected.to validate_inclusion_of(:category).in_array(CampaignReference::CATEGORIES) }

    it 'accepts pages from 1 to 999' do
      expect(build(:campaign_reference, page: 1)).to be_valid
      expect(build(:campaign_reference, page: 999)).to be_valid
      expect(build(:campaign_reference, page: 0)).not_to be_valid
      expect(build(:campaign_reference, page: nil)).to be_valid
    end

    it 'accepts real challenge ratings only' do
      %w[0 1/8 1/4 1/2 1 17 30].each do |cr|
        expect(build(:campaign_reference, challenge_rating: cr)).to be_valid, "expected CR #{cr} to be valid"
      end
      %w[31 1/3 -1 abc].each do |cr|
        expect(build(:campaign_reference, challenge_rating: cr)).not_to be_valid, "expected CR #{cr} to be invalid"
      end
    end
  end

  describe '#citation' do
    it 'names the book and page' do
      expect(build(:campaign_reference, book: 'phb', page: 239).citation).to eq("Player's Handbook p. 239")
    end

    it 'leaves out a missing page' do
      expect(build(:campaign_reference, book: 'dmg', page: nil).citation).to eq("Dungeon Master's Guide")
    end

    it 'names the SRD for entries from the free SRD 5.2 compendiums' do
      expect(build(:campaign_reference, book: 'srd', page: nil).citation).to eq('SRD 5.2')
    end
  end

  describe 'deleting' do
    it 'keeps NPCs that used it as a stat block' do
      reference = create(:campaign_reference, campaign: campaign)
      npc = create(:campaign_npc, campaign: campaign, stat_block_reference: reference)

      reference.destroy!

      expect(npc.reload.stat_block_reference).to be_nil
    end

    it 'removes session links to it' do
      reference = create(:campaign_reference, campaign: campaign)
      create(:campaign_session, campaign: campaign).links.create!(linkable: reference)

      expect { reference.destroy! }.to change(CampaignSessionLink, :count).by(-1)
    end

    it 'leaves a tombstone for sync' do
      reference = create(:campaign_reference, campaign: campaign)

      expect { reference.destroy! }.to change(CampaignTombstone, :count).by(1)
      expect(CampaignTombstone.last).to have_attributes(record_type: 'CampaignReference', record_uuid: reference.uuid)
    end
  end
end
