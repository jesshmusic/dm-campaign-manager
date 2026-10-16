require 'rails_helper'

RSpec.describe 'Admin::V1::PlayerCharactersController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }

  describe 'GET /v1/player-characters' do
    before { stub_authentication(user) }

    it "lists the DM's characters by world, without their sheets" do
      create(:player_character, user: user, name: 'Zed', world_id: 'eberron', world_title: 'Eberron')
      create(:player_character, user: user, name: 'Akra')
      create(:player_character, name: 'Not mine')

      get '/v1/player-characters'

      expect(response).to have_http_status(:success)
      expect(json.pluck('name', 'worldTitle', 'classes')).to eq([['Zed', 'Eberron', 'Cleric (Life Domain)'],
                                                                 ['Akra', 'Greyhawk', 'Cleric (Life Domain)']])
      expect(json.first).not_to have_key('sheet')
    end
  end

  context 'when not signed in' do
    before { stub_no_auth }

    it 'returns 401' do
      get '/v1/player-characters'

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
