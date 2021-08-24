require 'rails_helper'

RSpec.describe "DndClasses", type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:dnd_class, name: 'Sorcerer')
  }

  let(:valid_attributes_dm) {
    attributes_for(:dnd_class, user: dungeon_master, name: 'Sorcerer')
  }

  let!(:barbarian_class) { create :dnd_class_barbarian }
  let!(:bard_class) { create :dnd_class_bard }
  let!(:cleric_class) { create :dnd_class_cleric }
  let!(:fighter_class) { create :dnd_class_fighter }
  let!(:wizard_class) { create :dnd_class_wizard }
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

  describe "GET all DndClasses" do
    context "for Logged Out Users" do
      it "returns a success response" do
        get v1_dnd_classes_path
        expect(response).to have_http_status(200)
      end

      it "returns 5 DndClasses for logged out user" do
        get '/v1/dnd_classes.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(5)
        expect(result_items['results'].count).to eq(5)
      end
    end

    context "for Admins" do
      it "returns 7 DndClasses for signed in admin (Admins can see all classes)" do
        sign_in admin
        get '/v1/dnd_classes.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(7)
        expect(result_items['results'].count).to eq(7)
      end
    end

    context "for Dungeon Masters" do
      it "returns 6 DndClasses for signed in user who has created a custom class" do
        sign_in dungeon_master
        get '/v1/dnd_classes.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(6)
        expect(result_items['results'].count).to eq(6)
      end
    end
  end

  describe "GET a single DndClass" do
    context 'for Logged Out users' do
      it "returns error for logged out user" do
        get "/v1/dnd_classes/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq("User action not allowed.")
      end
    end

    context 'for Admin users' do
      it "returns a user's Death Knight class" do
        sign_in admin
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['slug']).to eq('death-knight-jesshdm')
        expect(result_item['name']).to eq('Death Knight')
      end
    end

    context 'for Dungeon Master users' do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/dnd_classes/#{fighter_class.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Death Knight class for logged in DM with proper slug" do
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['slug']).to eq('death-knight-jesshdm')
        expect(result_item['name']).to eq('Death Knight')
      end

      it "returns the other Death Knight class for logged in DM with proper slug" do
        sign_in other_user
        other_username = other_user.username
        get "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['slug']).not_to eq('death-knight-jesshdm')
        expect(result_item['slug']).to eq("death-knight-#{other_username}")
        expect(result_item['name']).to eq('Death Knight')
      end

      it "returns error for wrong user" do
        get "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq("User action not allowed.")
      end
    end
  end

  describe "POST Create DndClasses" do
    context "for Logged Out Users" do
      it "returns an error" do
        expect {
          post "/v1/dnd_classes.json", params: {dnd_class: valid_attributes}
        }.to change(DndClass, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      it "creates a new DndClass" do
        sign_in admin
        expect {
          post "/v1/dnd_classes.json", params: {dnd_class: valid_attributes}
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).to be_nil
        expect(result_item['name']).to eq('Sorcerer')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new DndClass" do
        expect {
          post "/v1/dnd_classes.json", params: {dnd_class: valid_attributes}
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).not_to be_nil
        expect(result_item['name']).to eq('Sorcerer')
        expect(result_item['slug']).to eq('sorcerer-jesshdm')
      end

      it "creates a new DndClasses with unique slugs" do
        post "/v1/dnd_classes.json", params: {dnd_class: valid_attributes}

        sign_in other_user
        other_username = other_user.username
        expect {
          post "/v1/dnd_classes.json", params: {dnd_class: valid_attributes}
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).not_to be_nil
        expect(result_item['userId']).to eq(other_user.id)
        expect(result_item['name']).to eq('Sorcerer')
        expect(result_item['slug']).to eq("sorcerer-#{other_username}")
      end
    end
  end

  describe "PUT update DndClasses" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        put "/v1/dnd_classes/#{fighter_class.slug}.json", params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "updates a default class" do
        put "/v1/dnd_classes/#{barbarian_class.slug}.json", params: {
          dnd_class: {
            name: 'Barbarian Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).to be_nil
        expect(result_item['name']).to eq('Barbarian Edited')
        expect(result_item['slug']).to eq('barbarian-edited')
      end

      it "updates a DM's class (rare) and persists the DM's ownership of the class" do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Death Knight Edited')
        expect(result_item['slug']).to eq('death-knight-edited-jesshdm')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "updates the requested item belonging to DM" do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Death Knight Edited')
        expect(result_item['slug']).to eq('death-knight-edited-jesshdm')
      end

      it "returns an error for attempting to edit another user's DndClass" do
        put "/v1/dnd_classes/#{death_knight_class_other.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for non-admin editing" do
        put "/v1/dnd_classes/#{fighter_class.slug}.json", params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE DndClasses" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        delete "/v1/dnd_classes/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes a default class" do
        delete "/v1/dnd_classes/#{fighter_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "updates a DM's class (rare) and persists the DM's ownership of the class" do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested item belonging to DM" do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for attempting to delete another user's DndClass" do
        delete "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for DM attempting to delete a default DndClass" do
        delete "/v1/dnd_classes/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end
end
