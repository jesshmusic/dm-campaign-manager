require 'rails_helper'

RSpec.describe "Characters", type: :request do
  let!(:dnd_class) { create :dnd_class }
  let!(:race) { create :race, id: 1, name: 'Human'}
  let(:valid_pc_attributes) {
    attributes_for(
      :player_character,
      name: 'Test PC',
      character_classes_attributes: [ {level: 1, dnd_class_id: dnd_class.id} ]
    )
  }
  let(:valid_npc_attributes) {
    attributes_for(
      :non_player_character,
      name: 'Test NPC',
      character_classes_attributes: [ {level: 5, dnd_class_id: dnd_class.id} ]
    )
  }
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign_many_chars, user: dungeon_master }
  let!(:campaign_unowned) { create :campaign_with_assoc }

  describe "GET /characters" do
    describe "GET /v1/campaigns/:campaign_slug/adventures" do
      it "returns a success response" do
        sign_in dungeon_master
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        expect(response).to have_http_status(200)
      end

      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        expect(response).to have_http_status(403)
      end

      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items['errors']).to eq("User action not allowed.")
      end

      it "returns 5 items" do
        sign_in dungeon_master
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(5)
      end
    end

    describe "GET /v1/campaigns/:campaign_slug/player_characters/:slug" do
      it "returns a success response" do
        sign_in dungeon_master
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns an error for forbidden" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_items = JSON.parse(response.body)
        expect(result_items['errors']).to eq("User action not allowed.")
      end

      it "returns Player Character" do
        sign_in dungeon_master
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq(campaign.pcs.first.name)
        expect(result_item['type']).to eq('PlayerCharacter')
      end
    end

    describe "GET /v1/campaigns/:campaign_slug/player_characters/:slug/edit" do

      it "returns a forbidden response" do
        character = campaign.pcs.first
        sign_in dungeon_master
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end

    describe "POST /v1/campaigns/:campaign_slug/adventures/" do
      context "with valid params belonging to DM" do
        it "creates a new Player Character" do
          sign_in dungeon_master
          expect {
            post "/v1/campaigns/#{campaign.slug}/player_characters.json", params: {character: valid_pc_attributes}
          }.to change(PlayerCharacter, :count).by(1)
          result_item = JSON.parse(response.body)
          expect(result_item['name']).to eq('Test PC')
        end

        it "returns an error for non-user creating item" do
          expect {
            post "/v1/campaigns/#{campaign.slug}/player_characters.json", params: {character: valid_pc_attributes}
          }.to change(PlayerCharacter, :count).by(0)
          result_item = JSON.parse(response.body)
          expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
        end
      end
    end

    describe "PUT /v1/campaigns/:campaign_slug/player_characters/:slug" do
      context "with valid params" do
        it "updates the requested item belonging to DM" do
          sign_in dungeon_master
          character = campaign.pcs.first
          put "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json", params: {
            player_character: {
              name: 'Test Character Edited',
            }
          }
          result_item = JSON.parse(response.body)
          expect(result_item['name']).to eq('Test Character Edited')
        end

        it "returns an error for non-user editing" do
          character = campaign.pcs.first
          put "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json", params: {
            player_character: {
              name: 'Test Item Edited',
            }
          }
          result_item = JSON.parse(response.body)
          expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
        end

        it "returns an error for non-admin editing" do
          character = campaign_unowned.pcs.first
          sign_in dungeon_master
          put "/v1/campaigns/#{campaign_unowned.slug}/player_characters/#{character.slug}.json", params: {
            character: {
              name: 'Test Item Edited',
            }
          }
          result_item = JSON.parse(response.body)
          expect(result_item['errors']).to eq('User action not allowed.')
        end
      end
    end

    describe "DELETE /v1/campaigns/:campaign_slug/player_characters/:slug" do
      context "with valid params" do
        it "deletes the requested item belonging to DM" do
          sign_in dungeon_master
          character = campaign.pcs.first
          delete "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
          expect(response).to have_http_status(204)
        end

        it "returns an error for non-user delete" do
          character = campaign.pcs.first
          delete "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
          result_item = JSON.parse(response.body)
          expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
        end
      end
    end
  end
end
