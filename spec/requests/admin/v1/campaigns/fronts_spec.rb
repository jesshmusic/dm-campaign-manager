require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::FrontsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:fronts_path) { "/v1/campaigns/#{campaign.slug}/fronts" }

  it_behaves_like 'a campaign child resource', path: 'fronts', root: :front, factory: :campaign_front do
    let(:valid_attributes) do
      { name: 'Cult of the Dragon', goal: 'Free Tiamat', doom: 'Tiamat rises', clock_segments: 8,
        stakes: ['Does Waterdeep fall?'], portents: [{ text: 'Raids begin', triggered: true }, { text: 'Masks appear' }] }
    end
    let(:created_json) do
      { 'name' => 'Cult of the Dragon', 'goal' => 'Free Tiamat', 'doom' => 'Tiamat rises', 'clockSegments' => 8,
        'clockFilled' => 0, 'stakes' => ['Does Waterdeep fall?'],
        'portents' => [{ 'text' => 'Raids begin', 'triggered' => true }, { 'text' => 'Masks appear', 'triggered' => false }] }
    end
    let(:invalid_attributes) { { clock_segments: 4, clock_filled: 5 } }
    let(:invalid_message) { "Clock filled can't be more than the clock's segments" }
    let(:update_attributes) { { clock_filled: 3 } }
    let(:updated_json) { { 'clockFilled' => 3 } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    let(:front) { create(:campaign_front, campaign: campaign, portents: [{ text: 'Raids begin' }]) }

    it 'orders fronts by creation' do
      first = create(:campaign_front, campaign: campaign, name: 'Zombies', created_at: 2.days.ago)
      second = create(:campaign_front, campaign: campaign, name: 'Assassins', created_at: 1.day.ago)

      get fronts_path

      expect(json.pluck('id')).to eq([first.id.to_s, second.id.to_s])
    end

    it 'triggers a portent' do
      patch "#{fronts_path}/#{front.id}", params: { front: { portents: [{ text: 'Raids begin', triggered: true }] } }, as: :json

      expect(response).to have_http_status(:success)
      expect(front.reload.portents).to eq([{ 'text' => 'Raids begin', 'triggered' => true }])
    end

    it 'clears portents with an empty list' do
      patch "#{fronts_path}/#{front.id}", params: { front: { portents: [] } }, as: :json

      expect(response).to have_http_status(:success)
      expect(front.reload.portents).to eq([])
    end

    it 'ignores unknown portent keys' do
      patch "#{fronts_path}/#{front.id}", params: { front: { portents: [{ text: 'Smoke', triggered: false, evil: 1 }] } },
                                          as: :json

      expect(front.reload.portents).to eq([{ 'text' => 'Smoke', 'triggered' => false }])
    end

    it 'rejects a portent without text' do
      patch "#{fronts_path}/#{front.id}", params: { front: { portents: [{ triggered: true }] } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Portents must be up to 10 portents, each with text')
    end

    it 'rejects a clock that is too large' do
      post fronts_path, params: { front: { name: 'Doom', clock_segments: 13 } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Clock segments must be in 2..12')
    end

    it 'links an NPC and faction from the campaign' do
      npc = create(:campaign_npc, campaign: campaign)
      faction = create(:campaign_faction, campaign: campaign)

      post fronts_path, params: { front: { name: 'Coup', npc_id: npc.id, faction_id: faction.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json).to include('npcId' => npc.id.to_s, 'factionId' => faction.id.to_s)
    end

    it 'rejects an NPC from another campaign' do
      npc = create(:campaign_npc, campaign: create(:campaign, user: user))

      post fronts_path, params: { front: { name: 'Coup', npc_id: npc.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Npc must belong to the same campaign')
    end
  end
end
