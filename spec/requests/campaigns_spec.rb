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

  describe "GET all Campaigns" do
    context "for Logged Out Users" do

      it "returns an error for forbidden" do
        get "/v1/campaigns.json"
        result_items = JSON.parse(response.body)
        expect(result_items['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns.json"
        expect(response).to have_http_status(200)
      end

      it "returns 5 items" do
        get "/v1/campaigns.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(5)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns.json"
        expect(response).to have_http_status(200)
      end

      it "returns 2 items" do
        get "/v1/campaigns.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(2)
      end
    end
  end

  describe "GET Single Campaign" do
    context "for Logged Out Users" do
      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}.json"
        result_items = JSON.parse(response.body)
        expect(result_items['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Campaign" do
        get "/v1/campaigns/#{campaign.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign')
        expect(result_item['world']).to eq('Greyhawk')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Campaign" do
        get "/v1/campaigns/#{campaign.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign')
        expect(result_item['world']).to eq('Greyhawk')
      end
    end
  end

  describe "GET Campaign back end Edit Page (admin only)" do
    context "for Logged Out Users" do
      it "returns a redirect response" do
        get "/v1/campaigns/#{campaign.slug}/edit"
        # Redirects to sign in page
        expect(response).to have_http_status(302)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/edit"
        expect(response).to have_http_status(200)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "POST Create a Campaign" do
    context "for Logged Out Users" do
      it "returns an error for non-user creating item" do
        expect {
          post "/v1/campaigns.json", params: {campaign: valid_attributes}
        }.to change(Campaign, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "creates a new Campaign for a DM (rare)" do
        expect {
          post "/v1/campaigns.json", params: {campaign: valid_attributes}
        }.to change(Campaign, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Campaign" do
        expect {
          post "/v1/campaigns.json", params: {campaign: valid_attributes}
        }.to change(Campaign, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign')
      end
    end
  end

  describe "PUT Update a Campaign" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        put "/v1/campaigns/#{campaign.slug}.json", params: {
          campaign: {
            name: 'Test Item Edited',
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

      it "updates the requested item belonging to DM (rare)" do
        put "/v1/campaigns/#{campaign.slug}.json", params: {
          campaign: {
            name: 'Test Campaign Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign Edited')
      end

    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "updates the requested item belonging to DM" do
        put "/v1/campaigns/#{campaign.slug}.json", params: {
          campaign: {
            name: 'Test Campaign Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Campaign Edited')
      end

      it "returns an error for non-admin editing" do
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

  describe "DELETE Delete a Campaign" do
    context "for Logged Out Users" do
      it "returns an error for non-user delete" do
        delete "/v1/campaigns/#{campaign.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes the requested item belonging to DM (rare)" do
        delete "/v1/campaigns/#{campaign.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested item belonging to DM" do
        delete "/v1/campaigns/#{campaign.slug}.json"
        expect(response).to have_http_status(204)
      end
    end
  end
end
