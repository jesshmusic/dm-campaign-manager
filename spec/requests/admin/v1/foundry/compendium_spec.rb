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

    it 'rejects a pack it does not support, unless it is homebrew' do
      post '/v1/foundry/compendium', params: { pack: 'world.homebrew', entries: [zombie] }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(["world.homebrew isn't a supported compendium"])
    end

    describe 'homebrew' do
      let(:owlbear_king) do
        { uuid: 'Compendium.world.my-monsters.Actor.abcdefghijklmnop', name: 'Owlbear King', category: 'monster',
          challengeRating: '5', detail: 'Monstrosity' }
      end

      def send_pack(pack, entries, **extra)
        post '/v1/foundry/compendium', params: { pack: pack, version: 'v1', entries: entries, homebrew: true, **extra },
                                       headers: headers, as: :json
      end

      it "indexes one of the DM's own compendiums with its title" do
        send_pack('world.my-monsters', [owlbear_king, zombie], label: '  My   Monsters ')

        expect(response).to have_http_status(:success)
        expect(json).to eq('pack' => 'world.my-monsters', 'count' => 1, 'skipped' => 1)
        expect(user.compendium_entries.sole).to have_attributes(name: 'Owlbear King', homebrew: true, pack_label: 'My Monsters',
                                                                challenge_rating: '5', book: 'other')
      end

      it "indexes a world's actors" do
        actor = { uuid: 'Actor.abcdefghijklmnop', name: 'Captain Brandt', category: 'monster', challengeRating: '3' }

        send_pack('world-actors.greyhawk', [actor], label: 'World actors (Greyhawk)')

        expect(json).to include('count' => 1)
        expect(user.compendium_entries.sole).to have_attributes(pack: 'world-actors.greyhawk', foundry_uuid: 'Actor.abcdefghijklmnop',
                                                                pack_label: 'World actors (Greyhawk)')
        get '/v1/foundry/compendium', headers: headers
        expect(response.parsed_body['packs']).to eq('world-actors.greyhawk' => { 'version' => 'v1', 'count' => 1 })
      end

      it 'removes a pack sent with no entries, with or without its title' do
        create(:compendium_entry, :homebrew, user: user)

        send_pack('world.my-monsters', [])

        expect(response).to have_http_status(:success)
        expect(user.compendium_entries).to be_empty
      end

      it 'needs a title of up to 120 characters' do
        send_pack('world.my-monsters', [owlbear_king])
        expect(json['errors']).to eq(["label must be the compendium's title"])

        send_pack('world.my-monsters', [owlbear_king], label: 'x' * 121)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to eq(['label is too long (maximum is 120 characters)'])
        expect(user.compendium_entries).to be_empty
      end

      it 'needs a pack id' do
        ['world', 'world.my.monsters', 'world.my monsters', "world.#{'x' * 100}"].each do |pack|
          send_pack(pack, [owlbear_king], label: 'Mine')

          expect(response).to have_http_status(:unprocessable_entity), "expected #{pack.inspect} to be rejected"
        end
        expect(user.compendium_entries).to be_empty
      end

      it 'takes up to 50 homebrew compendiums' do
        stub_const('CompendiumEntry::MAX_HOMEBREW_PACKS', 2)
        create(:compendium_entry, :homebrew, user: user, pack: 'world.one')
        create(:compendium_entry, :homebrew, user: user, pack: 'world.two')

        send_pack('world.three', [owlbear_king.merge(uuid: 'Compendium.world.three.Actor.abcdefghijklmnop')], label: 'Three')
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['No more than 2 homebrew compendiums'])

        send_pack('world.two', [owlbear_king.merge(uuid: 'Compendium.world.two.Actor.abcdefghijklmnop')], label: 'Two')
        expect(response).to have_http_status(:success)
      end

      it 'treats a core book pack as the book, whatever it says' do
        send_pack('dnd-monster-manual.actors', [zombie], label: 'Mine')

        expect(user.compendium_entries.sole).to have_attributes(homebrew: false, pack_label: nil, book: 'mm')
      end
    end

    it 'rejects entries that are not a list' do
      post '/v1/foundry/compendium', params: { pack: 'dnd-monster-manual.actors', entries: 'Zombie' },
                                     headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['entries must be a list'])
    end
  end
end
