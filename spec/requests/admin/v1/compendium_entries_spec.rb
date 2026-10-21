require 'rails_helper'

RSpec.describe 'Admin::V1::CompendiumEntriesController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }

  describe 'GET /v1/compendium' do
    before { stub_authentication(user) }

    it "searches the user's own index" do
      create(:compendium_entry, user: user, name: 'Zombie', challenge_rating: '1/4')
      create(:compendium_entry, name: 'Zombie Lord')

      get '/v1/compendium', params: { search: 'zom' }

      expect(response).to have_http_status(:success)
      expect(json['indexed']).to be(true)
      expect(json['results']).to contain_exactly(include('name' => 'Zombie', 'challengeRating' => '1/4', 'book' => 'mm'))
    end

    it 'filters by category' do
      create(:compendium_entry, user: user, name: 'Zombie')
      create(:compendium_entry, user: user, name: 'Zombie Wave', category: 'spell', pack: 'dnd5e.spells24',
                                foundry_uuid: 'Compendium.dnd5e.spells24.Item.zombieWave000000')

      get '/v1/compendium', params: { search: 'zom', categories: 'spell,nonsense' }

      expect(json['results'].pluck('name')).to eq(['Zombie Wave'])
    end

    it "includes the DM's homebrew, labelled with its pack's title" do
      create(:compendium_entry, user: user, name: 'Zombie')
      create(:compendium_entry, :homebrew, user: user, name: 'Zombie King', challenge_rating: '5')

      get '/v1/compendium', params: { search: 'zom', categories: 'monster' }

      expect(json['results']).to contain_exactly(
        include('name' => 'Zombie', 'book' => 'mm', 'homebrew' => false),
        include('name' => 'Zombie King', 'book' => 'other', 'bookName' => 'Homebrew: My Monsters', 'challengeRating' => '5',
                'homebrew' => true)
      )
    end

    it "leaves out a campaign's excluded homebrew" do
      campaign = create(:campaign, user: user, excluded_compendium_packs: ['world.my-monsters'])
      create(:compendium_entry, :homebrew, user: user, name: 'Zombie King')

      get '/v1/compendium', params: { search: 'zom', campaign: campaign.slug }

      expect(json['results']).to eq([])
    end

    it "leaves out a campaign's excluded compendiums" do
      campaign = create(:campaign, user: user, excluded_compendium_packs: ['dnd-monster-manual.actors'])
      create(:compendium_entry, user: user, name: 'Zombie')
      create(:compendium_entry, user: user, name: 'Zombie', pack: 'dnd5e.actors24')

      get '/v1/compendium', params: { search: 'zom', campaign: campaign.slug }

      expect(json['results']).to contain_exactly(include('name' => 'Zombie', 'book' => 'srd'))
    end

    it 'reports nothing indexed when there are no entries to search' do
      get '/v1/compendium', params: { search: 'zom' }

      expect(json).to eq('indexed' => false, 'results' => [])
    end

    it 'reports nothing indexed when the campaign excludes every compendium the user has' do
      campaign = create(:campaign, user: user, excluded_compendium_packs: ['dnd-monster-manual.actors'])
      create(:compendium_entry, user: user, name: 'Zombie')

      get '/v1/compendium', params: { search: 'zom', campaign: campaign.slug }

      expect(json['indexed']).to be(false)
    end

    it "ignores another user's campaign" do
      campaign = create(:campaign, excluded_compendium_packs: ['dnd-monster-manual.actors'])
      create(:compendium_entry, user: user, name: 'Zombie')

      get '/v1/compendium', params: { search: 'zom', campaign: campaign.slug }

      expect(json['results'].pluck('name')).to eq(['Zombie'])
    end
  end

  describe 'GET /v1/compendium/packs' do
    before { stub_authentication(user) }

    it "lists the user's packs with counts" do
      create(:compendium_entry, user: user)
      create(:compendium_entry, pack: 'dnd5e.actors24')

      get '/v1/compendium/packs'

      expect(json).to eq([{ 'pack' => 'dnd-monster-manual.actors', 'book' => 'mm', 'bookName' => 'Monster Manual',
                            'label' => 'Monsters', 'count' => 1, 'homebrew' => false }])
    end

    it 'lists homebrew packs too, by their titles' do
      create(:compendium_entry, :homebrew, user: user)

      get '/v1/compendium/packs'

      expect(json).to eq([{ 'pack' => 'world.my-monsters', 'book' => 'other', 'bookName' => 'Homebrew', 'label' => 'My Monsters',
                            'count' => 1, 'homebrew' => true }])
    end
  end

  context 'when not signed in' do
    before { stub_no_auth }

    it 'returns 401' do
      get '/v1/compendium', params: { search: 'zom' }
      expect(response).to have_http_status(:unauthorized)

      get '/v1/compendium/packs'
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
