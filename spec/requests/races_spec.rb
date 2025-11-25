require 'rails_helper'

RSpec.describe 'Races', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:race, user: dungeon_master, name: 'New Race')
  }

  # Create default SRD races (user_id: nil) using factories
  let!(:default_race1) { create :race, name: 'Dwarf', user: nil }
  let!(:default_race2) { create :race, name: 'Elf', user: nil }
  let!(:default_race3) { create :race, name: 'Human', user: nil }

  # Custom races owned by users
  let!(:race_custom1) { create :race,
                               user: dungeon_master,
                               name: 'DM Race' }
  let!(:race_custom2) { create :race,
                               user: other_user,
                               name: 'Other UserProps Race' }

  describe 'GET Return all Races' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get '/v1/races.json'
        expect(response).to have_http_status(200)
      end

      it 'returns only default races' do
        get '/v1/races.json'
        result_races = JSON.parse(response.body)
        # Should only see default races (user_id: nil), not custom ones
        expect(result_races['count']).to eq(3)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'returns all races (default + all custom)' do
        get '/v1/races.json'
        result_races = JSON.parse(response.body)
        # Admins see everything: 3 default + 2 custom = 5
        expect(result_races['count']).to eq(5)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns races that are only default or owned by this DM' do
        get '/v1/races.json'
        result_races = JSON.parse(response.body)
        # DM sees: 3 default + 1 own custom = 4
        expect(result_races['count']).to eq(4)
        expect(result_races['results'].find { |race|
          race['name'] == 'DM Race'
        }).not_to be_nil
        expect(result_races['results'].find { |race|
          race['name'] == 'Other UserProps Race'
        }).to be_nil
      end
    end

  end

  describe 'GET Return single Race' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get "/v1/races/#{default_race1.slug}.json"
        expect(response).to have_http_status(200)
      end

      it 'returns error for logged out user trying to get custom race' do
        get "/v1/races/#{race_custom1.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'returns a default race' do
        get "/v1/races/#{default_race1.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq(default_race1.name)
        expect(result_race['slug']).to eq(default_race1.slug)
      end

      it 'returns custom race for a DM' do
        get "/v1/races/#{race_custom2.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq('Other UserProps Race')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'returns a default race' do
        get "/v1/races/#{default_race1.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq(default_race1.name)
        expect(result_race['slug']).to eq(default_race1.slug)
      end

      it 'returns a custom DM race' do
        get "/v1/races/#{race_custom1.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq('DM Race')
        expect(result_race['slug']).to eq(race_custom1.slug)
      end

      it 'returns error for DM trying to get custom race by another user' do
        get "/v1/races/#{race_custom2.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'POST Create Race' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user creating race' do
        stub_no_auth
        expect {
          post '/v1/races.json', params: { race: valid_attributes }
        }.to change(Race, :count).by(0)
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq(['Not Authenticated'])
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'creates a new Race' do
        expect {
          post '/v1/races.json', params: { race: valid_attributes }
        }.to change(Race, :count).by(1)
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq('New Race')
        expect(result_race['userId']).to be_nil
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'creates a new Race with a user' do
        expect {
          post '/v1/races.json', params: { race: valid_attributes }
        }.to change(Race, :count).by(1)
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq('New Race')
        expect(result_race['userId']).not_to be_nil
      end
    end
  end

  describe 'PUT Update Race' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user editing' do
        stub_no_auth
        put "/v1/races/#{default_race2.slug}.json", params: {
          race: {
            name: 'Test Race Edited'
          }
        }
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq(['Not Authenticated'])
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

      it 'updates the requested race belonging to DM' do
        put "/v1/races/#{race_custom1.slug}.json", params: {
          race: {
            name: 'Test Race Edited'
          }
        }
        result_race = JSON.parse(response.body)
        expect(result_race['name']).to eq('Test Race Edited')
        expect(result_race['userId']).to eq(dungeon_master.id)
      end

      it 'returns an error for non-admin editing default race' do
        put "/v1/races/#{default_race2.slug}.json", params: {
          race: {
            name: 'Test Race Edited'
          }
        }
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin editing other DM\'s race' do
        put "/v1/races/#{race_custom2.slug}.json", params: {
          race: {
            name: 'Test Race Edited'
          }
        }
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE Delete Race' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user delete' do
        stub_no_auth
        delete "/v1/races/#{default_race2.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq(['Not Authenticated'])
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'for Admins' do
      before(:each) do
        stub_authentication(admin)
      end

      it 'deletes the requested race belonging to DM' do
        delete "/v1/races/#{race_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'deletes the requested default race' do
        delete "/v1/races/#{default_race2.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        stub_authentication(dungeon_master)
      end

      it 'deletes the requested race belonging to DM' do
        delete "/v1/races/#{race_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'returns an error for non-admin deleting default race' do
        delete "/v1/races/#{default_race2.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin deleting other DM\'s race' do
        delete "/v1/races/#{race_custom2.slug}.json"
        result_race = JSON.parse(response.body)
        expect(result_race['errors']).to eq('UserProps action not allowed.')
      end
    end
  end
end
