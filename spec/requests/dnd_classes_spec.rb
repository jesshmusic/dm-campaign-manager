require 'rails_helper'

RSpec.describe 'DndClasses', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:dnd_class, name: 'Sorcerer Supreme')
  }

  let(:valid_attributes_dm) {
    attributes_for(:dnd_class, user: dungeon_master, name: 'Sorcerer Supreme DM')
  }

  let!(:death_knight_class) {
    create :dnd_class,
           name: 'Death Knight',
           user: dungeon_master
  }
  let!(:death_knight_class_other) {
    create :dnd_class,
           name: 'Death Knight',
           user: other_user
  }

  describe 'GET /v1/dnd_classes' do
    before() do
      death_knight_class.subclasses = ['Super Death Knight']
      death_knight_class_other.subclasses = ['Super Duper Death Knight']
    end
    context 'for Logged Out Users' do
      it 'should return a success response' do
        get v1_dnd_classes_path
        expect(response).to have_http_status(200)
      end

      it 'should return 12 DndClasses for logged out user' do
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(12)
        expect(result_items[:results].count).to eq(12)
      end

      it 'should return results based on search query' do
        get '/v1/dnd_classes.json?search=fighter'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(1)
        expect(result_monsters[:results].first[:name]).to eq('Fighter')
      end
    end

    context 'for Admins' do
      it 'should return 14 DndClasses for signed in admin (Admins can see all classes)' do
        sign_in admin
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(14)
        expect(result_items[:results].count).to eq(14)
      end
    end

    context 'for Dungeon Masters' do
      it 'should return 13 DndClasses for signed in user who has created a custom class' do
        sign_in dungeon_master
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(13)
        expect(result_items[:results].count).to eq(13)
      end
    end
  end

  describe 'GET /v1/dnd_classes/:slug' do
    context 'for Logged Out users' do
      it 'should return error for logged out user' do
        get '/v1/dnd_classes/fighter.json'
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('fighter')
        expect(result_item[:name]).to eq('Fighter')
      end
    end

    context 'for Admin users' do
      it 'should return a user\'s Death Knight class' do
        sign_in admin
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('death-knight-jesshdm1')
        expect(result_item[:name]).to eq('Death Knight')
      end
    end

    context 'for Dungeon Master users' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a success response' do
        get '/v1/dnd_classes/fighter.json'
        expect(response).to have_http_status(200)
      end

      it 'should return Death Knight class for logged in DM with proper slug' do
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('death-knight-jesshdm1')
        expect(result_item[:name]).to eq('Death Knight')
      end

      it 'should return the other Death Knight class for logged in DM with proper slug' do
        sign_in other_user
        other_username = other_user.username
        get "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).not_to eq('death-knight-jesshdm1')
        expect(result_item[:slug]).to eq("death-knight-#{other_username}")
        expect(result_item[:name]).to eq('Death Knight')
      end
    end
  end

  describe 'GET /v1/dnd_classes/new' do
    context 'for Logged Out Users' do
      it 'should return a redirect response' do
        get '/v1/dnd_classes/new'
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return a success response' do
        get '/v1/dnd_classes/new'
        expect(response).to have_http_status(200)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a success response' do
        get '/v1/dnd_classes/new'
        expect(response).to have_http_status(200)
      end
    end
  end

  describe 'GET /v1/dnd_classes/:slug/edit' do
    context 'for Logged Out Users' do
      it 'should return a redirect response' do
        get '/v1/dnd_classes/fighter/edit'
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should return a success response' do
        get '/v1/dnd_classes/fighter/edit'
        expect(response).to have_http_status(200)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a forbidden response' do
        get '/v1/dnd_classes/fighter/edit'
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'POST /v1/dnd_classes' do
    context 'for Logged Out Users' do
      it 'should return an error' do
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        }.to change(DndClass, :count).by(0)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      it 'should create a new DndClass' do
        sign_in admin
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).to be_nil
        expect(result_item[:name]).to eq('Sorcerer Supreme')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should create a new DndClass' do
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes_dm }
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).not_to be_nil
        expect(result_item[:name]).to eq('Sorcerer Supreme DM')
        expect(result_item[:slug]).to eq('sorcerer-supreme-dm-jesshdm1')
      end

      it 'should create a new DndClasses with unique slugs' do
        post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes_dm }

        sign_in other_user
        other_username = other_user.username
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).not_to be_nil
        expect(result_item[:userId]).to eq(other_user.id)
        expect(result_item[:name]).to eq('Sorcerer Supreme')
        expect(result_item[:slug]).to eq("sorcerer-supreme-#{other_username}")
      end
    end
  end

  describe 'PATCH/PUT /v1/dnd_classes/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user editing' do
        put '/v1/dnd_classes/fighter.json', params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should update a default class' do
        put '/v1/dnd_classes/barbarian.json', params: {
          dnd_class: {
            name: 'Barbarian Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).to be_nil
        expect(result_item[:name]).to eq('Barbarian Edited')
        expect(result_item[:slug]).to eq('barbarian-edited')
      end

      it 'should update a DM\'s class (rare) and persists the DM\'s ownership of the class' do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:name]).to eq('Death Knight Edited')
        expect(result_item[:slug]).to eq('death-knight-edited-jesshdm1')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should update the requested item belonging to DM' do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:name]).to eq('Death Knight Edited')
        expect(result_item[:slug]).to eq('death-knight-edited-jesshdm1')
      end

      it 'should return an error for attempting to edit another user\'s DndClass' do
        put "/v1/dnd_classes/#{death_knight_class_other.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end

      it 'should return an error for non-admin editing' do
        put '/v1/dnd_classes/fighter.json', params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE /v1/dnd_classes/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user editing' do
        delete '/v1/dnd_classes/fighter.json'
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should delete a default class' do
        delete '/v1/dnd_classes/fighter.json'
        expect(response).to have_http_status(204)
      end

      it 'should update a DM\'s class (rare) and persists the DM\'s ownership of the class' do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should delete the requested item belonging to DM' do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'should return an error for attempting to delete another user\'s DndClass' do
        delete "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end
end
