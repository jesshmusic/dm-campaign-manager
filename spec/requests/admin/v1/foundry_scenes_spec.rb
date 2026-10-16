require 'rails_helper'

RSpec.describe 'Admin::V1::FoundryScenesController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }

  describe 'GET /v1/foundry_scenes' do
    before { stub_authentication(user) }

    it "lists the DM's own scenes, by world title then name" do
      cave = create(:foundry_scene, user: user, name: 'Cave', world_id: 'greyhawk', world_title: 'Greyhawk')
      pass = create(:foundry_scene, user: user, name: 'Mountain Pass', world_id: 'greyhawk', world_title: 'Greyhawk')
      dock = create(:foundry_scene, user: user, name: 'Docks', world_id: 'eberron', world_title: 'Eberron')
      create(:foundry_scene, name: 'Not mine')

      get '/v1/foundry_scenes'

      expect(response).to have_http_status(:success)
      expect(json['count']).to eq(3)
      expect(json['results'].pluck('name')).to eq(%w[Docks Cave] + ['Mountain Pass'])
      expect(json['results'].first).to eq(
        'uuid' => dock.foundry_uuid, 'name' => 'Docks', 'thumbnailUrl' => dock.thumbnail_url, 'worldId' => 'eberron',
        'worldTitle' => 'Eberron'
      )
      expect(json['results'].pluck('uuid')).to eq([dock, cave, pass].map(&:foundry_uuid))
    end

    it 'is empty until Foundry sends scenes' do
      get '/v1/foundry_scenes'

      expect(response).to have_http_status(:success)
      expect(json).to eq('count' => 0, 'results' => [])
    end
  end

  context 'when not signed in' do
    before { stub_no_auth }

    it 'returns 401' do
      get '/v1/foundry_scenes'

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
