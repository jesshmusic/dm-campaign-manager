require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::CompendiumController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }
  let(:zombie) do
    { uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000', name: 'Zombie', category: 'monster',
      challengeRating: '1/4', detail: 'Undead' }
  end

  describe 'GET /v1/foundry/compendium' do
    it 'lists the packs Dungeon Master Guru has, with versions and counts' do
      create_list(:compendium_entry, 2, user: user, pack_version: 'mm@1')
      create(:compendium_entry, pack_version: 'not mine')

      get '/v1/foundry/compendium', headers: headers

      expect(response).to have_http_status(:success)
      expect(json).to eq('packs' => { 'dnd-monster-manual.actors' => { 'version' => 'mm@1', 'count' => 2 } })
    end

    it 'is open to any signed-up user with a token' do
      member = create(:user)
      member_headers = { 'Authorization' => "Bearer #{ApiToken.issue!(user: member, name: 'Foundry').plaintext_token}" }

      get '/v1/foundry/compendium', headers: member_headers

      expect(response).to have_http_status(:success)
      expect(json).to eq('packs' => {})
    end

    it 'needs a valid API token' do
      get '/v1/foundry/compendium'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /v1/foundry/compendium' do
    it "replaces the pack's entries" do
      create(:compendium_entry, user: user, name: 'Old')

      post '/v1/foundry/compendium', params: { pack: 'dnd-monster-manual.actors', version: 'mm@2', entries: [zombie] },
                                     headers: headers, as: :json

      expect(response).to have_http_status(:success)
      expect(json).to eq('pack' => 'dnd-monster-manual.actors', 'count' => 1, 'skipped' => 0)
      expect(user.compendium_entries.sole).to have_attributes(name: 'Zombie', pack_version: 'mm@2')
    end

    it 'counts the entries it skipped' do
      post '/v1/foundry/compendium',
           params: { pack: 'dnd-monster-manual.actors', entries: [zombie, zombie.merge(category: 'nope'), 'text'] },
           headers: headers, as: :json

      expect(json).to include('count' => 1, 'skipped' => 2)
    end

    it 'rejects a pack it does not support' do
      post '/v1/foundry/compendium', params: { pack: 'world.homebrew', entries: [zombie] }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(["world.homebrew isn't a supported compendium"])
    end

    it 'rejects entries that are not a list' do
      post '/v1/foundry/compendium', params: { pack: 'dnd-monster-manual.actors', entries: 'Zombie' },
                                     headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['entries must be a list'])
    end
  end
end
