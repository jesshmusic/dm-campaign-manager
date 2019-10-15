require 'rails_helper'

RSpec.describe "Guilds", type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:race) { create :race, id: 1, name: 'Human'}
  let!(:dnd_class) { create :dnd_class }

  let(:valid_attributes) do
    attributes_for(:guild,
                   name: 'Test Guild')
  end

  let!(:campaign) {
    create :campaign_without_guild,
           user: dungeon_master,
           name: 'Test Campaign',
           world: 'Greyhawk',
           adventures_attributes: [
             {
               name: 'Test Adventure',
               description: 'An adventure for testing'
             }
           ],
           guilds_attributes: [
             {
               name: "Thieves' Guild",
               description: "A test guild"
             }, {
               name: "The Conclave",
               description: "Another test guild"
             }
           ]
  }
  let!(:campaign1) { create :campaign_with_assoc }

  before(:each) do
    @guild = campaign.guilds.first
    @pc1 = campaign.pcs.first
    @pc2 = campaign.pcs[1]
    @npc1 = campaign.npcs.first
    @npc2 = campaign.npcs[1]
  end

  describe "GET all Guilds for Campaign" do
    context "for Logged Out Users" do

      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}/guilds.json"
        result_items = JSON.parse(response.body)
        expect(result_items['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/guilds.json"
        expect(response).to have_http_status(200)
      end

      it "returns 2 items" do
        get "/v1/campaigns/#{campaign.slug}/guilds.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(2)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/guilds.json"
        expect(response).to have_http_status(200)
      end

      it "returns a forbidden response for unowned campaign" do
        get "/v1/campaigns/#{campaign1.slug}/guilds.json"
        result_users = JSON.parse(response.body)
        expect(result_users['errors']).to eq("User action not allowed.")
      end

      it "returns 2 valid guilds" do
        get "/v1/campaigns/#{campaign.slug}/guilds.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(2)
        expect(result_items[0]['slug']).to eq(@guild.slug)
        expect(result_items[0]['name']).to eq("Thieves' Guild")
        expect(result_items[0]['description']).to eq("A test guild")
        expect(result_items[0]['pcs'].count).to eq(0)
        expect(result_items[0]['npcs'].count).to eq(0)
      end
    end
  end

  describe "GET Single Guild" do
    context "for Logged Out Users" do
      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        result_items = JSON.parse(response.body)
        expect(result_items['error']).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Guild" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq("Thieves' Guild")
        expect(result_item['description']).to eq("A test guild")
        expect(result_item['pcs'].count).to eq(0)
        expect(result_item['npcs'].count).to eq(0)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns a forbidden response for unowned guild" do
        get "/v1/campaigns/#{campaign1.slug}/guilds/#{campaign1.guilds.first.slug}.json"
        result_users = JSON.parse(response.body)
        expect(result_users['errors']).to eq("User action not allowed.")
      end

      it "returns Guild" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq("Thieves' Guild")
        expect(result_item['description']).to eq("A test guild")
        expect(result_item['pcs'].count).to eq(0)
        expect(result_item['npcs'].count).to eq(0)
      end
    end
  end

  describe "GET Guild back end Edit Page (admin only)" do
    context "for Logged Out Users" do
      it "returns a redirect response" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}/edit"
        # Redirects to sign in page
        expect(response).to have_http_status(302)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}/edit"
        expect(response).to have_http_status(200)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "POST Create a Guild" do
    context "for Logged Out Users" do
      it "returns an error for non-user creating item" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/guilds.json", params: {guild: valid_attributes}
        }.to change(Guild, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "creates a new Guild for a DM (rare)" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/guilds.json", params: {guild: valid_attributes}
        }.to change(Guild, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Guild')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Guild" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/guilds.json", params: {guild: valid_attributes}
        }.to change(Guild, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Guild')
      end
    end
  end

  describe "PUT Update a Guild" do
    context "for Logged Out Users" do
      it "returns an error for non-user editing" do
        put "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json", params: {
          guild: {
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
        put "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json", params: {
          guild: {
            name: 'Test Guild Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Guild Edited')
      end

    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "updates the requested item belonging to DM" do
        put "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json", params: {
          guild: {
            name: 'Test Guild Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Guild Edited')
      end

      it "should add 2 NPCs to the guild" do
        put "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json", params: {
          guild: {
            character_ids: [@npc1.id, @npc2.id]
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['pcs'].count).to eq(0)
        expect(result_item['npcs'].count).to eq(2)
      end

      it "should add 2 PCs to the guild" do
        put "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json", params: {
          guild: {
            character_ids: [@pc1.id, @pc2.id]
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['npcs'].count).to eq(0)
        expect(result_item['pcs'].count).to eq(2)
      end

      it "returns an error for non-admin editing" do
        put "/v1/campaigns/#{campaign1.slug}/guilds/#{campaign1.guilds.first.slug}.json", params: {
          guild: {
            name: 'Test Item Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE Delete a Guild" do
    context "for Logged Out Users" do
      it "returns an error for non-user delete" do
        delete "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes the requested item belonging to DM (rare)" do
        delete "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested item belonging to DM" do
        delete "/v1/campaigns/#{campaign.slug}/guilds/#{@guild.slug}.json"
        expect(response).to have_http_status(204)
      end
    end
  end
end
