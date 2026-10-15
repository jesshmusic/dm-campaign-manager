require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::FactionsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }

  it_behaves_like 'a campaign child resource', path: 'factions', root: :faction, factory: :campaign_faction do
    let(:valid_attributes) { { name: 'Zhentarim', description: 'Mercenaries', goal: 'Control trade', notes: 'Hiring' } }
    let(:created_json) do
      { 'name' => 'Zhentarim', 'description' => 'Mercenaries', 'goal' => 'Control trade', 'notes' => 'Hiring' }
    end
    let(:invalid_attributes) { { name: '' } }
    let(:invalid_message) { "Name can't be blank" }
    let(:update_attributes) { { goal: 'Seize Phandalin' } }
    let(:updated_json) { { 'goal' => 'Seize Phandalin' } }
  end

  describe 'GET /v1/campaigns/:campaign_id/factions' do
    before { stub_authentication(user) }

    it 'orders factions by name' do
      create(:campaign_faction, campaign: campaign, name: 'Zhentarim')
      create(:campaign_faction, campaign: campaign, name: 'Harpers')

      get "/v1/campaigns/#{campaign.slug}/factions"

      expect(json.pluck('name')).to eq(%w[Harpers Zhentarim])
    end
  end

  describe 'DELETE /v1/campaigns/:campaign_id/factions/:id' do
    before { stub_authentication(user) }

    it 'keeps its members' do
      faction = create(:campaign_faction, campaign: campaign)
      npc = create(:campaign_npc, campaign: campaign, faction: faction)

      delete "/v1/campaigns/#{campaign.slug}/factions/#{faction.id}"

      expect(response).to have_http_status(:no_content)
      expect(npc.reload.faction_id).to be_nil
    end
  end
end
