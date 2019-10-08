require 'rails_helper'

RSpec.describe "Spells", type: :request do
  describe "GET all Spells" do
    context "for Logged Out Users" do
      it "returns a success response" do
        get v1_spells_path
        expect(response).to have_http_status(200)
      end

      it "returns 5 Spells for logged out user" do
        get '/v1/spells.json'
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(5)
      end
    end

    context "for Admins" do
      it "returns 7 Spells for signed in admin (Admins can see all classes)" do
        sign_in admin
        get '/v1/spells.json'
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(7)
      end
    end

    context "for Dungeon Masters" do
      it "returns 6 Spells for signed in user who has created a custom class" do
        sign_in dungeon_master
        get '/v1/spells.json'
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(6)
      end
    end
  end

  describe "GET a single Spell" do
    context 'for Logged Out users' do
      it "returns error for logged out user" do
        get "/v1/spells/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq("User action not allowed.")
      end
    end

    context 'for Admin users' do
      it "returns a user's Death Knight class" do
        sign_in admin
        get "/v1/spells/#{death_knight_class.slug}.json"
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
        get "/v1/spells/#{fighter_class.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Death Knight class for logged in DM with proper slug" do
        get "/v1/spells/#{death_knight_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['slug']).to eq('death-knight-jesshdm')
        expect(result_item['name']).to eq('Death Knight')
      end

      it "returns the other Death Knight class for logged in DM with proper slug" do
        sign_in other_user
        other_username = other_user.username
        get "/v1/spells/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['slug']).not_to eq('death-knight-jesshdm')
        expect(result_item['slug']).to eq("death-knight-#{other_username}")
        expect(result_item['name']).to eq('Death Knight')
      end

      it "returns error for wrong user" do
        get "/v1/spells/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq("User action not allowed.")
      end
    end
  end

  describe "POST Create Spells" do
    context "for Logged Out Users" do
      it "returns an error" do
        expect {
          post "/v1/spells.json", params: {spell: valid_attributes}
        }.to change(Spell, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      it "creates a new Spell" do
        sign_in admin
        expect {
          post "/v1/spells.json", params: {spell: valid_attributes}
        }.to change(Spell, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).to be_nil
        expect(result_item['name']).to eq('Sorcerer')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Spell" do
        expect {
          post "/v1/spells.json", params: {spell: valid_attributes}
        }.to change(Spell, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).not_to be_nil
        expect(result_item['name']).to eq('Sorcerer')
        expect(result_item['slug']).to eq('sorcerer-jesshdm')
      end

      it "creates a new Spells with unique slugs" do
        post "/v1/spells.json", params: {spell: valid_attributes}

        sign_in other_user
        other_username = other_user.username
        expect {
          post "/v1/spells.json", params: {spell: valid_attributes}
        }.to change(Spell, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).not_to be_nil
        expect(result_item['userId']).to eq(other_user.id)
        expect(result_item['name']).to eq('Sorcerer')
        expect(result_item['slug']).to eq("sorcerer-#{other_username}")
      end
    end
  end

  describe "PUT update Spells" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        put "/v1/spells/#{fighter_class.slug}.json", params: {
          spell: {
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
        put "/v1/spells/#{barbarian_class.slug}.json", params: {
          spell: {
            name: 'Barbarian Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['userId']).to be_nil
        expect(result_item['name']).to eq('Barbarian Edited')
        expect(result_item['slug']).to eq('barbarian-edited')
      end

      it "updates a DM's class (rare) and persists the DM's ownership of the class" do
        put "/v1/spells/#{death_knight_class.slug}.json", params: {
          spell: {
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
        put "/v1/spells/#{death_knight_class.slug}.json", params: {
          spell: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Death Knight Edited')
        expect(result_item['slug']).to eq('death-knight-edited-jesshdm')
      end

      it "returns an error for attempting to edit another user's Spell" do
        put "/v1/spells/#{death_knight_class_other.slug}.json", params: {
          spell: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for non-admin editing" do
        put "/v1/spells/#{fighter_class.slug}.json", params: {
          spell: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE Spells" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        delete "/v1/spells/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes a default class" do
        delete "/v1/spells/#{fighter_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "updates a DM's class (rare) and persists the DM's ownership of the class" do
        delete "/v1/spells/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested item belonging to DM" do
        delete "/v1/spells/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for attempting to delete another user's Spell" do
        delete "/v1/spells/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for DM attempting to delete a default Spell" do
        delete "/v1/spells/#{fighter_class.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "Get TEMPLATE" do
    context "for Logged Out Users" do

    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

    end
  end
end
