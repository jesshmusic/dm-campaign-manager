# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Adventures', type: :request do
  let(:valid_attributes) do
    attributes_for(:adventure, name: 'Test Adventure')
  end

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) {
    create :campaign_with_assoc,
           user: dungeon_master,
           adventures_attributes: [
             {
               name: 'Test Adventure',
               description: 'An adventure for testing'
             }
           ]
  }
  let!(:campaign_unowned) { create :campaign_with_assoc }
  let!(:world_location) { create :world_location, campaign: campaign }

  describe "GET /v1/campaigns/:campaign_slug/adventures" do
    it "returns a success response" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures.json"
      expect(response).to have_http_status(200)
    end

    it "returns a forbidden response" do
      get "/v1/campaigns/#{campaign.slug}/adventures.json"
      expect(response).to have_http_status(403)
    end

    it "returns an error for forbidden" do
      get "/v1/campaigns/#{campaign.slug}/adventures.json"
      result_items = JSON.parse(response.body)
      expect(result_items['errors']).to eq("User action not allowed.")
    end

    it "returns 6 items" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures.json"
      result_items = JSON.parse(response.body)
      expect(result_items.count).to eq(6)
    end
  end

  describe "GET /v1/campaigns/:campaign_slug/adventures/:id" do
    it "returns a success response" do
      sign_in dungeon_master
      adventure = campaign.adventures.first
      get "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json"
      expect(response).to have_http_status(200)
    end

    it "returns an error for forbidden" do
      adventure = campaign.adventures.first
      get "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json"
      result_items = JSON.parse(response.body)
      expect(result_items['errors']).to eq("User action not allowed.")
    end

    it "returns Adventure" do
      sign_in dungeon_master
      adventure = campaign.adventures.first
      get "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json"
      result_item = JSON.parse(response.body)
      expect(result_item['name']).to eq('Test Adventure')
      expect(result_item['description']).to eq('An adventure for testing')
    end
  end

  describe "GET /v1/campaigns/:campaign_slug/adventures/:id/edit" do

    it "returns a forbidden response" do
      adventure = campaign.adventures.first
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}/edit"
      expect(response).to have_http_status(403)
    end
  end

  describe "POST /v1/campaigns/:campaign_slug/adventures/" do
    context "with valid params belonging to DM" do
      it "creates a new Adventure" do
        sign_in dungeon_master
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures.json", params: {adventure: valid_attributes}
        }.to change(Adventure, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Adventure')
      end

      it "returns an error for non-user creating item" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures.json", params: {adventure: valid_attributes}
        }.to change(Adventure, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "PUT /v1/campaigns/:campaign_slug/adventures/:id" do
    context "with valid params" do
      it "updates the requested item belonging to DM" do
        sign_in dungeon_master
        adventure = campaign.adventures.first
        put "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json", params: {
          adventure: {
            name: 'Test Adventure Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Adventure Edited')
      end

      it "returns an error for non-user editing" do
        adventure = campaign.adventures.first
        put "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json", params: {
          adventure: {
            name: 'Test Item Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for non-admin editing" do
        adventure = campaign_unowned.adventures.first
        sign_in dungeon_master
        put "/v1/campaigns/#{campaign_unowned.slug}/adventures/#{adventure.id}.json", params: {
          adventure: {
            name: 'Test Item Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE /v1/campaigns/:campaign_slug/adventures/:id" do
    context "with valid params" do
      it "deletes the requested item belonging to DM" do
        sign_in dungeon_master
        adventure = campaign.adventures.first
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for non-user delete" do
        adventure = campaign.adventures.first
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{adventure.id}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end
end
