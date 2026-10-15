require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::QuestsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quests_path) { "/v1/campaigns/#{campaign.slug}/quests" }

  it_behaves_like 'a campaign child resource', path: 'quests', root: :quest, factory: :campaign_quest do
    let(:valid_attributes) do
      { name: 'Find Cragmaw Castle', kind: 'main', status: 'active', act: 1, position: 2, level_min: 2, level_max: 3,
        reward: '200 gp', description: 'Rescue Gundren', notes: 'Owlbear' }
    end
    let(:created_json) do
      { 'name' => 'Find Cragmaw Castle', 'kind' => 'main', 'status' => 'active', 'act' => 1, 'position' => 2,
        'levelMin' => 2, 'levelMax' => 3, 'reward' => '200 gp' }
    end
    let(:invalid_attributes) { { level_min: 5, level_max: 2 } }
    let(:invalid_message) { "Level max can't be lower than the minimum level" }
    let(:update_attributes) { { status: 'completed' } }
    let(:updated_json) { { 'status' => 'completed' } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    it 'orders main quests by act and position before side quests' do
      side = create(:campaign_quest, campaign: campaign, kind: 'side', name: 'Side')
      act_two = create(:campaign_quest, campaign: campaign, kind: 'main', act: 2, name: 'Act II')
      act_one_late = create(:campaign_quest, campaign: campaign, kind: 'main', act: 1, position: 1, name: 'Act I b')
      act_one = create(:campaign_quest, campaign: campaign, kind: 'main', act: 1, position: 0, name: 'Act I a')

      get quests_path

      expect(json.pluck('id')).to eq([act_one, act_one_late, act_two, side].map { |quest| quest.id.to_s })
    end

    it 'links a parent quest, giver and location from the campaign' do
      parent = create(:campaign_quest, campaign: campaign)
      npc = create(:campaign_npc, campaign: campaign)
      location = create(:campaign_location, campaign: campaign)

      post quests_path, params: { quest: { name: 'Sub-quest', parent_id: parent.id, giver_npc_id: npc.id,
                                           location_id: location.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json).to include('parentId' => parent.id.to_s, 'giverNpcId' => npc.id.to_s, 'locationId' => location.id.to_s)
    end

    it 'rejects links from another campaign' do
      elsewhere = create(:campaign, user: user)

      post quests_path, params: { quest: { name: 'Cross-campaign', giver_npc_id: create(:campaign_npc, campaign: elsewhere).id,
                                           location_id: create(:campaign_location, campaign: elsewhere).id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Giver npc must belong to the same campaign', 'Location must belong to the same campaign')
    end

    it 'rejects an unknown kind' do
      post quests_path, params: { quest: { name: 'Epic', kind: 'epic' } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Kind is not included in the list')
    end

    it 'rejects a quest as its own parent' do
      quest = create(:campaign_quest, campaign: campaign)

      patch "#{quests_path}/#{quest.id}", params: { quest: { parent_id: quest.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include("Parent can't be this quest or one of its sub-quests")
    end
  end
end
