require 'rails_helper'

RSpec.describe "Spells", type: :request do
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

  describe "GET Return all Spells" do
    context "for Logged Out Users" do
      it "returns a success response" do
        get '/v1/spells.json'
        expect(response).to have_http_status(200)
      end

      it "returns 3 spells" do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(3)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns 5 spells" do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(5)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns 4 spells that are only default or owned by this DM" do
        get '/v1/spells.json'
        result_spells = JSON.parse(response.body)
        expect(result_spells['count']).to eq(4)
        expect(result_spells['results'].find { |spell|
          spell['name'] == 'DM Spell'
        }).not_to be_nil
        expect(result_spells['results'].find { |spell|
          spell['name'] == 'Other UserProps Spell'
        }).to be_nil
      end
    end

  end

  describe "GET Return single Spell" do
    context "for Logged Out Users" do
      it "returns a success response" do
        get "/v1/spells/#{spell1.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns error for logged out user trying to get custom spell" do
        get "/v1/spells/#{spell_custom1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq("UserProps action not allowed.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a default spell" do
        get "/v1/spells/#{spell.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq(spell.name)
        expect(result_spell['slug']).to eq(spell.slug)
      end

      it "returns custom spell for a DM" do
        get "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('Other UserProps Spell')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a default spell" do
        get "/v1/spells/#{spell.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq(spell.name)
        expect(result_spell['slug']).to eq(spell.slug)
      end

      it "returns a custom DM spell" do
        get "/v1/spells/#{spell_custom1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('DM Spell')
        expect(result_spell['slug']).to eq('dm-spell-jesshdm1')
      end

      it "returns error for DM trying to get custom spell by another user" do
        get "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq("UserProps action not allowed.")
      end
    end
  end

  describe "GET Spell back end Edit Page (admin only)" do
    context "for Logged Out Users" do
      it "returns a redirect response" do
        get "/v1/spells/#{spell1.slug}/edit"
        expect(response).to have_http_status(302)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/spells/#{spell1.slug}/edit"
        expect(response).to have_http_status(200)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a forbidden response" do
        get "/v1/spells/#{spell1.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "POST Create Spell" do
    context "for Logged Out Users" do
      it "returns an error for non-user creating spell" do
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(0)
        result_spell = JSON.parse(response.body)
        expect(result_spell['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "creates a new Spell" do
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(1)
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('New Spell')
        expect(result_spell['userId']).to be_nil
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Spell with a user" do
        expect {
          post '/v1/spells.json', params: { spell: valid_attributes }
        }.to change(Spell, :count).by(1)
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('New Spell')
        expect(result_spell['userId']).not_to be_nil
      end
    end
  end

  describe "PUT Update Spell" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        put "/v1/spells/#{spell1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['error']).to eq('You need to sign in or sign up before continuing.')
      end
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

      it "updates the requested spell belonging to DM" do
        put "/v1/spells/#{spell_custom1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['name']).to eq('Test Spell Edited')
        expect(result_spell['userId']).to eq(dungeon_master.id)
      end

      it "returns an error for non-admin editing default spell" do
        put "/v1/spells/#{spell1.slug}.json", params: {
          spell: {
            name: 'Test Spell Edited'
          }
        }
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end

      it "returns an error for non-admin editing other DM's spell" do
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

  describe "DELETE Delete Spell" do
    context "for Logged Out Users" do
      it "returns an error for non-user delete" do
        delete "/v1/spells/#{spell1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes the requested spell belonging to DM" do
        delete "/v1/spells/#{spell_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "deletes the requested default spell" do
        delete "/v1/spells/#{spell1.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested spell belonging to DM" do
        delete "/v1/spells/#{spell_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for non-admin deleting default spell" do
        delete "/v1/spells/#{spell1.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
      end

      it "returns an error for non-admin deleting other DM's spell" do
        delete "/v1/spells/#{spell_custom2.slug}.json"
        result_spell = JSON.parse(response.body)
        expect(result_spell['errors']).to eq('UserProps action not allowed.')
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
