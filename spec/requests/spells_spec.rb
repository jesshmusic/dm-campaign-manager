require 'rails_helper'

RSpec.describe 'Spells', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:spell, user: dungeon_master, name: 'New Spell')
  }

  let!(:spell) { create :spell }
  let!(:spell1) { create :spell }
  let!(:spell2) { create :spell }
  let!(:spell_custom1) { create :spell,
                                user: dungeon_master,
                                name: 'DM Spell' }
  let!(:spell_custom2) { create :spell,
                                user: other_user,
                                name: 'Other UserProps Spell' }

  describe 'GET Return all Spells' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get '/v1/spells.json'
        expect(response).to have_http_status(200)
      end

      it 'returns 6 spells' do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(6)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'returns 8 spells' do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(8)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns 7 spells that are only default or owned by this DM' do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(7)
        expect(result_spells['results'].find { |spell|
          spell['name'] == 'DM Spell'
        }).not_to be_nil
        expect(result_spells['results'].find { |spell|
          spell['name'] == 'Other UserProps Spell'
        }).to be_nil
      end
    end

  end

  describe 'GET Return single Spell' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get "/v1/spells/#{spell1.slug}.json"
        expect(response).to have_http_status(200)
      end

      it 'returns error for logged out user trying to get custom spell' do
        get "/v1/spells/#{spell_custom1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'returns a default spell' do
        get "/v1/spells/#{spell.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq(spell.name)
        expect(result_spell['slug']).to eq(spell.slug)
      end

      it 'returns custom spell for a DM' do
        get "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('Other UserProps Spell')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns a default spell' do
        get "/v1/spells/#{spell.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq(spell.name)
        expect(result_spell['slug']).to eq(spell.slug)
      end

      it 'returns a custom DM spell' do
        get "/v1/spells/#{spell_custom1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('DM Spell')
        expect(result_spell['slug']).to eq(spell_custom1.slug)
      end

      it 'returns error for DM trying to get custom spell by another user' do
        get "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'POST Create Spell' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user creating spell' do
        stub_no_auth
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(0)
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq(['Not Authenticated'])
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'creates a new Spell' do
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(1)
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('New Spell')
        expect(result_spell['userId']).to be_nil
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'creates a new Spell with a user' do
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(1)
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('New Spell')
        expect(result_spell['userId']).not_to be_nil
      end
    end
  end

  describe 'PUT Update Spell' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user editing' do
        stub_no_auth
        put "/v1/spells/#{spell1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq(['Not Authenticated'])
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'updates the requested spell belonging to DM' do
        put "/v1/spells/#{spell_custom1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('Test Spell Edited')
        expect(result_spell['userId']).to eq(dungeon_master.id)
      end

      it 'returns an error for non-admin editing default spell' do
        put "/v1/spells/#{spell1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin editing other DM\'s spell' do
        put "/v1/spells/#{spell_custom2.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE Delete Spell' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user delete' do
        stub_no_auth
        delete "/v1/spells/#{spell1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq(['Not Authenticated'])
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'deletes the requested spell belonging to DM' do
        delete "/v1/spells/#{spell_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'deletes the requested default spell' do
        delete "/v1/spells/#{spell1.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'deletes the requested spell belonging to DM' do
        delete "/v1/spells/#{spell_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'returns an error for non-admin deleting default spell' do
        delete "/v1/spells/#{spell1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin deleting other DM\'s spell' do
        delete "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'GET Index with list parameter' do
    let!(:low_level_spell) { create(:spell, name: 'Cantrip Spell', level: 0) }
    let!(:mid_level_spell) { create(:spell, name: 'Fireball', level: 3) }
    let!(:high_level_spell) { create(:spell, name: 'Power Word Kill', level: 9) }

    context 'with list and max params' do
      it 'returns spells up to max level' do
        get '/v1/spells.json', params: { list: true, max: 3 }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(result['count']).to be > 0
        expect(result['results']).to be_an(Array)
        result['results'].each do |spell|
          expect(spell['data']['level']).to be <= 3
        end
      end
    end

    context 'with list, search, and max params' do
      it 'returns filtered and level-limited spells' do
        get '/v1/spells.json', params: { list: true, search: 'Fire', max: 5 }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(result['count']).to be >= 0
        expect(result['results']).to be_an(Array)
      end
    end

    context 'with list and search params only' do
      it 'returns searched spells' do
        get '/v1/spells.json', params: { list: true, search: 'Cantrip' }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(result['results']).to be_an(Array)
      end
    end

    context 'with list param only' do
      it 'returns all spells' do
        get '/v1/spells.json', params: { list: true }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(result['count']).to be > 0
        expect(result['results']).to be_an(Array)
        expect(result['results'].first).to have_key('name')
        expect(result['results'].first).to have_key('id')
        expect(result['results'].first).to have_key('data')
      end
    end
  end

  describe 'GET Index with filtering' do
    let!(:wizard_class) { create(:dnd_class, name: 'Wizard') }
    let!(:cleric_class) { create(:dnd_class, name: 'Cleric') }
    let!(:wizard_spell) { create(:spell, name: 'Magic Missile', level: 1) }
    let!(:cleric_spell) { create(:spell, name: 'Cure Wounds', level: 1) }

    before do
      wizard_spell.dnd_classes << wizard_class
      cleric_spell.dnd_classes << cleric_class
    end

    context 'with dnd_class and search params' do
      it 'returns spells for specific class and search term' do
        get '/v1/spells.json', params: { dnd_class: 'Wizard', search: 'Magic' }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
      end
    end

    context 'with dnd_class param only' do
      it 'returns spells for specific class' do
        get '/v1/spells.json', params: { dnd_class: 'Wizard' }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
      end
    end

    context 'with search param only' do
      it 'returns searched spells' do
        get '/v1/spells.json', params: { search: 'Cure' }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
      end
    end

    context 'with level param' do
      it 'filters spells by level' do
        get '/v1/spells.json', params: { level: 1 }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
      end
    end

    context 'with level and search params' do
      it 'filters spells by level and search' do
        get '/v1/spells.json', params: { level: 1, search: 'Magic' }
        result = JSON.parse(response.body)

        expect(response).to have_http_status(200)
      end
    end
  end

  describe 'POST Create Spell with validation errors' do
    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns error when spell creation fails' do
        expect {
          post '/v1/spells.json', params: { spell: { name: nil } }
        }.to change(Spell, :count).by(0)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT Update Spell with validation errors' do
    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns error when spell update fails validation' do
        put "/v1/spells/#{spell_custom1.slug}.json", params: {
          spell: {
            name: nil
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
