require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::MonstersController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }

  describe 'GET /v1/foundry/monsters/:id' do
    it "returns the DM's own homebrew monster as a dnd5e actor" do
      monster = create(:monster, user: user, name: 'Owlbear King', size: 'Large', challenge_rating: '5')

      get "/v1/foundry/monsters/#{monster.id}", headers: headers

      expect(response).to have_http_status(:success)
      expect(json).to include('id' => monster.id.to_s, 'name' => 'Owlbear King')
      expect(json['actor']).to include('name' => 'Owlbear King', 'type' => 'npc', 'img' => MonsterFoundryActor::IMG)
      expect(json['actor']['system']['details']).to include('cr' => 5.0)
      expect(json['actor']['prototypeToken']).to include('name' => 'Owlbear King', 'width' => 2, 'height' => 2, 'actorLink' => false)
    end

    it 'returns a public SRD monster' do
      monster = create(:monster, user: nil, name: 'Zombie')

      get "/v1/foundry/monsters/#{monster.id}", headers: headers

      expect(response).to have_http_status(:success)
      expect(json['actor']['name']).to eq('Zombie')
    end

    it "doesn't find someone else's homebrew" do
      monster = create(:monster, user: create(:dungeon_master_user))

      get "/v1/foundry/monsters/#{monster.id}", headers: headers

      expect(response).to have_http_status(:not_found)
      expect(json['errors']).to eq(['Monster not found'])
    end

    it "doesn't find a monster that doesn't exist" do
      get '/v1/foundry/monsters/0', headers: headers

      expect(response).to have_http_status(:not_found)
    end

    it 'needs a valid API token' do
      get "/v1/foundry/monsters/#{create(:monster, user: nil).id}"

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
