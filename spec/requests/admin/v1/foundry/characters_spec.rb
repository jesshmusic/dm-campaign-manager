require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::CharactersController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }
  let(:world) { { id: 'greyhawk', title: 'Greyhawk' } }
  let(:akra) do
    { uuid: 'Actor.a1B2c3D4e5F6g7H8', name: 'Akra', playerName: 'Sam', level: 3,
      sheet: { summary: 'Level 3 Dragonborn Cleric', abilities: [{ key: 'str', score: 13 }] } }
  end

  before { create(:patreon_user, :wizard, user_id: nil, linked_user: user) }

  describe 'POST /v1/foundry/characters' do
    it "replaces the world's characters" do
      post '/v1/foundry/characters', params: { world: world, characters: [akra] }, headers: headers, as: :json

      expect(response).to have_http_status(:success)
      expect(json).to eq('count' => 1, 'skipped' => 0)
      expect(user.player_characters.sole).to have_attributes(
        name: 'Akra', world_id: 'greyhawk', world_title: 'Greyhawk',
        sheet: { 'summary' => 'Level 3 Dragonborn Cleric', 'abilities' => [{ 'key' => 'str', 'score' => 13 }] }
      )
    end

    it 'counts the characters it skipped' do
      post '/v1/foundry/characters',
           params: { world: world, characters: [akra, akra.merge(uuid: 'bad'), 'text'] }, headers: headers, as: :json

      expect(json).to eq('count' => 1, 'skipped' => 2)
    end

    it 'needs a world' do
      post '/v1/foundry/characters', params: { characters: [akra] }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['world must have an id'])
    end

    it 'rejects characters that are not a list' do
      post '/v1/foundry/characters', params: { world: world, characters: 'Akra' }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['characters must be a list'])
    end

    it 'needs premium access' do
      user.patreon_account.destroy!

      post '/v1/foundry/characters', params: { world: world, characters: [akra] }, headers: headers, as: :json

      expect(response).to have_http_status(:forbidden)
      expect(user.player_characters).to be_empty
    end

    it 'needs a valid API token' do
      post '/v1/foundry/characters', params: { world: world, characters: [akra] }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
