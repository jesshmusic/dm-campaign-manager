require 'rails_helper'

RSpec.describe CampaignPartyMember, type: :model do
  it 'is valid from the factory' do
    expect(build(:campaign_party_member)).to be_valid
  end

  it "only takes the DM's own characters" do
    member = build(:campaign_party_member, player_character: create(:player_character))

    expect(member).not_to be_valid
    expect(member.errors[:player_character]).to include('must be one of your characters')
  end

  it 'adds a character to a party once' do
    member = create(:campaign_party_member)

    expect(build(:campaign_party_member, campaign: member.campaign,
                                         player_character: member.player_character)).not_to be_valid
  end
end
