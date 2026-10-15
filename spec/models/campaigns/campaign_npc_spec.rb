require 'rails_helper'

RSpec.describe CampaignNpc, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }

  describe 'validations' do
    subject { build(:campaign_npc, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:role).in_array(CampaignNpc::ROLES) }

    it 'defaults to a neutral role' do
      expect(described_class.new.role).to eq('neutral')
    end
  end

  describe 'faction' do
    it 'can belong to a faction in the same campaign' do
      faction = create(:campaign_faction, campaign: campaign)

      expect(build(:campaign_npc, campaign: campaign, faction: faction)).to be_valid
    end

    it 'rejects a faction from another campaign' do
      npc = build(:campaign_npc, campaign: campaign, faction: create(:campaign_faction))

      expect(npc).not_to be_valid
      expect(npc.errors[:faction]).to include('must belong to the same campaign')
    end

    it 'rejects a faction that does not exist' do
      npc = build(:campaign_npc, campaign: campaign, faction_id: 0)

      expect(npc).not_to be_valid
      expect(npc.errors[:faction]).to include('must exist')
    end
  end

  describe 'monster' do
    it 'can use an SRD monster' do
      expect(build(:campaign_npc, campaign: campaign, monster: create(:monster, user: nil))).to be_valid
    end

    it "can use the DM's own homebrew monster" do
      expect(build(:campaign_npc, campaign: campaign, monster: create(:monster, user: user))).to be_valid
    end

    it "rejects another user's homebrew monster" do
      npc = build(:campaign_npc, campaign: campaign, monster: create(:monster, user: create(:dungeon_master_user)))

      expect(npc).not_to be_valid
      expect(npc.errors[:monster]).to include('is not available')
    end

    it 'rejects a monster that does not exist' do
      npc = build(:campaign_npc, campaign: campaign, monster_id: 0)

      expect(npc).not_to be_valid
      expect(npc.errors[:monster]).to include('must exist')
    end

    it 'is unlinked when the monster is deleted' do
      monster = create(:monster, user: user)
      npc = create(:campaign_npc, campaign: campaign, monster: monster)

      monster.destroy!

      expect(npc.reload.monster_id).to be_nil
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the NPC with a summary of its stat block' do
      monster = create(:monster, user: nil, name: 'Mage', challenge_rating: '6')
      npc = create(:campaign_npc, campaign: campaign, name: 'Iarno', role: 'villain', motive: 'Power', monster: monster)

      expect(npc.as_json_for_api).to include(
        id: npc.id.to_s, uuid: npc.uuid, name: 'Iarno', role: 'villain', motive: 'Power', factionId: nil,
        monster: { id: monster.id.to_s, name: 'Mage', slug: monster.slug, challengeRating: '6' }
      )
    end

    it 'has no monster when unlinked' do
      expect(create(:campaign_npc, campaign: campaign).as_json_for_api[:monster]).to be_nil
    end
  end
end
