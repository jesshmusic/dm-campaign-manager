require 'rails_helper'

RSpec.describe CampaignFaction, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_faction, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to belong_to(:campaign) }
  end

  it "clears its members' faction when destroyed" do
    faction = create(:campaign_faction, campaign: campaign)
    npc = create(:campaign_npc, campaign: campaign, faction: faction)
    front = create(:campaign_front, campaign: campaign, faction: faction)

    faction.destroy!

    expect(npc.reload.faction_id).to be_nil
    expect(front.reload.faction_id).to be_nil
  end

  describe '#as_json_for_api' do
    it 'serializes the faction' do
      faction = create(:campaign_faction, campaign: campaign, name: 'Zhentarim', description: 'Mercenaries',
                                          goal: 'Control trade', notes: 'Hiring')

      expect(faction.as_json_for_api).to eq(id: faction.id.to_s, uuid: faction.uuid, name: 'Zhentarim',
                                            description: 'Mercenaries', goal: 'Control trade', notes: 'Hiring')
    end
  end
end
