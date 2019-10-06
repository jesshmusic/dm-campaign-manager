require 'rails_helper'

RSpec.describe "Campaigns", type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:race) { create :race, id: 1, name: 'Human'}

  let(:valid_attributes) do
    attributes_for(:campaign_with_assoc, name: 'Test Campaign', user: dungeon_master)
  end

  let!(:campaign) {
    create :campaign_with_assoc,
           user: dungeon_master,
           name: 'Test Campaign',
           world: 'Greyhawk',
           adventures_attributes: [
             {
               name: 'Test Adventure',
               description: 'An adventure for testing'
             }
           ]
  }
  let!(:campaign1) { create :campaign }
  let!(:campaign2) { create :campaign }
  let!(:campaign3) { create :campaign }
  let!(:campaign4) { create :campaign, user: dungeon_master }

  describe "GET /v1/campaigns" do
    it "returns a success response" do
      sign_in dungeon_master
      get "/v1/campaigns.json"
      expect(response).to have_http_status(200)
    end

    it "returns a forbidden response" do
      get "/v1/campaigns.json"
      expect(response).to have_http_status(403)
    end

    it "returns an error for forbidden" do
      get "/v1/campaigns.json"
      result_items = JSON.parse(response.body)
      expect(result_items['errors']).to eq("User action not allowed.")
    end

    it "returns 2 items" do
      sign_in dungeon_master
      get "/v1/campaigns.json"
      result_items = JSON.parse(response.body)
      expect(result_items.count).to eq(2)
    end
  end

  describe "GET /v1/campaigns/:slug" do
    it "returns a success response" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}.json"
      expect(response).to have_http_status(200)
    end

    it "returns an error for forbidden" do
      get "/v1/campaigns/#{campaign.slug}.json"
      result_items = JSON.parse(response.body)
      expect(result_items['errors']).to eq("User action not allowed.")
    end

    it "returns Campaign" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}.json"
      result_item = JSON.parse(response.body)
      expect(result_item['name']).to eq('Test Campaign')
      expect(result_item['world']).to eq('Greyhawk')
    end
  end

  describe "GET /v1/campaigns/:slug/edit" do
    it "returns a forbidden response" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/edit"
      expect(response).to have_http_status(403)
    end
  end

  describe "POST /v1/campaigns/" do
    context "with valid params belonging to DM" do
      it "creates a new Adventure" do
        sign_in dungeon_master
        expect {
          post "/v1/campaigns.json", params: {campaign: valid_attributes}
        }.to change(Campaign, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign')
      end

      it "returns an error for non-user creating item" do
        expect {
          post "/v1/campaigns.json", params: {campaign: valid_attributes}
        }.to change(Campaign, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end
  end

  describe "PUT /v1/campaigns/:slug" do
    context "with valid params" do
      it "updates the requested item belonging to DM" do
        sign_in dungeon_master
        put "/v1/campaigns/#{campaign.slug}.json", params: {
          campaign: {
            name: 'Test Adventure Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Adventure Edited')
      end

      it "returns an error for non-user editing" do
        put "/v1/campaigns/#{campaign.slug}.json", params: {
          campaign: {
            name: 'Test Item Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end

      it "returns an error for non-admin editing" do
        sign_in dungeon_master
        put "/v1/campaigns/#{campaign3.slug}.json", params: {
          campaign: {
            name: 'Test Item Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE /v1/campaigns/:slug" do
    context "with valid params" do
      it "deletes the requested item belonging to DM" do
        sign_in dungeon_master
        delete "/v1/campaigns/#{campaign.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for non-user delete" do
        delete "/v1/campaigns/#{campaign.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end
  end
end
