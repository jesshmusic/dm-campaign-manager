require 'rails_helper'

RSpec.describe 'Monsters', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:monster, user: dungeon_master, name: 'New Monster')
  }

  let(:invalid_attributes) {
    attributes_for(:monster, user: dungeon_master, fish_lips: 'NOPE')
  }

  let!(:monster) { create :monster }
  let!(:monster1) { create :monster }
  let!(:monster2) { create :monster }
  let!(:monster_custom1) { create :monster, user: dungeon_master, name: 'DM Monster' }
  let!(:monster_custom2) { create :monster, user: other_user, name: 'Other UserProps Monster' }

  describe 'GET /v1/monsters' do
    context 'for Logged Out Users' do
      it 'should return a success response' do
        get '/v1/monsters.json'
        expect(response).to have_http_status(200)
      end

      it 'should return 335 monsters' do
        get '/v1/monsters.json'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(335)
      end

      it 'should return results based on search query' do
        get '/v1/monsters.json?search=orc'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(1)
        expect(result_monsters[:results].first[:name]).to eq('Orc')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return 335 monsters' do
        get '/v1/monsters.json'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(337)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return 336 monsters that are only default or owned by this DM' do
        get '/v1/monsters.json'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(336)
        expect(result_monsters[:results].find { |monster|
          monster[:name] == 'DM Monster'
        }).not_to be_nil
        expect(result_monsters[:results].find { |monster|
          monster[:name] == 'Other UserProps Monster'
        }).to be_nil
      end
    end

  end

  describe 'GET /v1/monster-categories' do
    context 'for Logged Out Users' do
      it 'should return a success response' do
        get '/v1/monster-categories'
        expect(response).to have_http_status(200)
      end

      it 'should return 15 categories' do
        get '/v1/monster-categories'
        results = JSON.parse response.body, symbolize_names: true
        expect(results[:count]).to eq(15)
        expect(results[:results].count).to eq(15)
      end
    end
  end

  describe 'GET /v1/monster/:slug' do
    context 'for Logged Out Users' do
      it 'should return a success response' do
        get "/v1/monsters/#{monster1.slug}.json"
        expect(response).to have_http_status(200)
      end

      it 'should return error for logged out user trying to get custom monster' do
        get "/v1/monsters/#{monster_custom1.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return a default monster' do
        get "/v1/monsters/#{monster.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq(monster.name)
        expect(result_monster[:slug]).to eq(monster.slug)
      end

      it 'should return custom monster for a DM' do
        get "/v1/monsters/#{monster_custom2.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq('Other UserProps Monster')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a default monster' do
        get "/v1/monsters/#{monster.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq(monster.name)
        expect(result_monster[:slug]).to eq(monster.slug)
      end

      it 'should return a custom DM monster' do
        get "/v1/monsters/#{monster_custom1.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq('DM Monster')
        expect(result_monster[:slug]).to eq('dm-monster-jesshdm1')
      end

      it 'should return error for DM trying to get custom monster by another user' do
        get "/v1/monsters/#{monster_custom2.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'GET /v1/monsters/:slug/edit' do
    context 'for Logged Out Users' do
      it 'should return a redirect response' do
        get "/v1/monsters/#{monster1.slug}/edit"
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return a success response' do
        get "/v1/monsters/#{monster1.slug}/edit"
        expect(response).to have_http_status(200)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a forbidden response' do
        get "/v1/monsters/#{monster1.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'GET /v1/monsters/new' do
    context 'for Logged Out Users' do
      it 'should return a redirect response' do
        get '/v1/monsters/new'
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return a success response' do
        get '/v1/monsters/new'
        expect(response).to have_http_status(200)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a forbidden response' do
        get '/v1/monsters/new'
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'POST /monsters' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user creating monster' do
        expect {
          post '/v1/monsters.json', params: { monster: valid_attributes }
        }.to change(Monster, :count).by(0)
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should create a new Monster' do
        expect {
          post '/v1/monsters.json', params: { monster: valid_attributes }
        }.to change(Monster, :count).by(1)
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq('New Monster')
        expect(result_monster[:userId]).to be_nil
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should create a new Monster with a user' do
        expect {
          post '/v1/monsters.json', params: { monster: valid_attributes }
        }.to change(Monster, :count).by(1)
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq('New Monster')
        expect(result_monster[:userId]).not_to be_nil
      end
    end
  end

  describe 'PATCH/PUT /monsters/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user editing' do
        put "/v1/monsters/#{monster1.slug}.json", params: {
          monster: {
            name: 'Test Monster Edited',
            armor_class: 19
          }
        }
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should update the requested monster belonging to DM' do
        put "/v1/monsters/#{monster_custom1.slug}.json", params: {
          monster: {
            name: 'Test Monster Edited',
            armor_class: 19
          }
        }
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:name]).to eq('Test Monster Edited')
        expect(result_monster[:armorClass]).to eq(19)
        expect(result_monster[:userId]).to eq(dungeon_master.id)
      end

      it 'should return an error for non-admin editing default monster' do
        put "/v1/monsters/#{monster1.slug}.json", params: {
          monster: {
            name: 'Test Monster Edited',
            armor_class: 19
          }
        }
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end

      it 'should return an error for non-admin editing other DM\'s monster' do
        put "/v1/monsters/#{monster_custom2.slug}.json", params: {
          monster: {
            name: 'Test Monster Edited',
            armor_class: 19
          }
        }
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE /monsters/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user delete' do
        delete "/v1/monsters/#{monster1.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should delete the requested monster belonging to DM' do
        delete "/v1/monsters/#{monster_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'should delete the requested default monster' do
        delete "/v1/monsters/#{monster1.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should delete the requested monster belonging to DM' do
        delete "/v1/monsters/#{monster_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'should return an error for non-admin deleting default monster' do
        delete "/v1/monsters/#{monster1.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end

      it 'should return an error for non-admin deleting other DM\'s monster' do
        delete "/v1/monsters/#{monster_custom2.slug}.json"
        result_monster = JSON.parse response.body, symbolize_names: true
        expect(result_monster[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end
end
