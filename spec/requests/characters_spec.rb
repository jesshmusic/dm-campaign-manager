require 'rails_helper'

RSpec.describe "Characters", type: :request do
  let!(:dnd_class) { create :dnd_class }
  let!(:race) { create :race, id: 1, name: 'Human'}
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign_with_assoc, user: dungeon_master }
  let!(:campaign_unowned) { create :campaign_with_assoc }
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
      guild_id: campaign.guilds.first.id,
      character_classes_attributes: [ {level: 5, dnd_class_id: dnd_class.id} ]
    )
  }

  describe "GET All PCs and NPCs for a campaign" do
    context "for Logged Out Users" do
      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        expect(response).to have_http_status(403)
      end

      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items['errors']).to eq("User action not allowed.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        expect(response).to have_http_status(200)
      end

      it "returns 5 PCs" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(5)
      end

      it "returns 10 NPCs" do
        get "/v1/campaigns/#{campaign.slug}/non_player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to be >= 10
      end

    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        expect(response).to have_http_status(200)
      end

      it "returns 5 PCs" do
        get "/v1/campaigns/#{campaign.slug}/player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to eq(5)
      end

      it "returns 10 NPCs" do
        get "/v1/campaigns/#{campaign.slug}/non_player_characters.json"
        result_items = JSON.parse(response.body)
        expect(result_items.count).to be >= 10
      end
    end
  end

  describe "GET Single Character" do
    context "for Logged Out Users" do
      it "returns an error for forbidden" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_items = JSON.parse(response.body)
        expect(result_items['errors']).to eq("User action not allowed.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Player Character" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq(campaign.pcs.first.name)
        expect(result_item['type']).to eq('PlayerCharacter')
        expect(result_item['guild']).to be_nil
      end

      it "returns Non-player Character" do
        character = campaign.npcs.first
        get "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq(campaign.npcs.first.name)
        expect(result_item['type']).to eq('NonPlayerCharacter')
        expect(result_item['guild']).not_to be_nil
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        expect(response).to have_http_status(200)
      end

      it "returns Player Character" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq(campaign.pcs.first.name)
        expect(result_item['type']).to eq('PlayerCharacter')
        expect(result_item['guild']).to be_nil
      end

      it "returns Non-player Character" do
        character = campaign.npcs.first
        get "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq(campaign.npcs.first.name)
        expect(result_item['type']).to eq('NonPlayerCharacter')
        expect(result_item['guild']).not_to be_nil
      end
    end
  end

  describe "GET Character back end Edit Page (admin only)" do
    context "for Logged Out Users" do
      it "returns a redirect response" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}/edit"
        # Redirects to sign in page
        expect(response).to have_http_status(302)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}/edit"
        expect(response).to have_http_status(200)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a forbidden response" do
        character = campaign.pcs.first
        get "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}/edit"
        expect(response).to have_http_status(403)
      end
    end


  end

  describe "POST Create a PC or NPC" do
    context "for Logged Out Users" do
      it "returns an error for non-user creating item" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/player_characters.json", params: {character: valid_pc_attributes}
        }.to change(PlayerCharacter, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "creates a new Player Character (rare)" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/player_characters.json", params: {player_character: valid_pc_attributes}
        }.to change(PlayerCharacter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test PC')
        expect(result_item['guild']).to be_nil
        campaign.reload
        expect(campaign.pcs.count).to eq(6)
      end

      it "creates a new Non-player Character (rare)" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/non_player_characters.json", params: {non_player_character: valid_npc_attributes}
        }.to change(NonPlayerCharacter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test NPC')
        expect(result_item['guild']).not_to be_nil
        campaign.reload
        expect(campaign.npcs.count).to be >= 11
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Player Character" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/player_characters.json", params: {player_character: valid_pc_attributes}
        }.to change(PlayerCharacter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test PC')
        expect(result_item['guild']).to be_nil
        campaign.reload
        expect(campaign.pcs.count).to eq(6)
      end

      it "creates a new Non-player Character" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/non_player_characters.json", params: {non_player_character: valid_npc_attributes}
        }.to change(NonPlayerCharacter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test NPC')
        expect(result_item['guild']).not_to be_nil
      end
    end
  end

  describe "PUT Edit a PC or NPC" do
    context "for Logged Out Users" do
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
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "updates the requested PC belonging to DM" do
        character = campaign.pcs.first
        put "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json", params: {
          player_character: {
            name: 'Test Character Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Character Edited')
      end

      it "updates the requested NPC belonging to DM" do
        character = campaign.npcs.first
        put "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json", params: {
          non_player_character: {
            name: 'Test Character Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Character Edited')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "updates the requested PC belonging to DM" do
        character = campaign.pcs.first
        put "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json", params: {
          player_character: {
            name: 'Test Character Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Character Edited')
      end

      it "updates the requested NPC belonging to DM" do
        character = campaign.npcs.first
        put "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json", params: {
          non_player_character: {
            name: 'Test Character Edited',
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Character Edited')
      end

      it "returns an error for editing an unowned character" do
        character = campaign_unowned.pcs.first
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

  describe "DELETE Delete a PC or NPC" do
    context "for Logged Out Users" do
      it "returns an error for non-user delete" do
        character = campaign.pcs.first
        delete "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes the requested PC belonging to DM (rare)" do
        character = campaign.pcs.first
        delete "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        expect(response).to have_http_status(204)
        campaign.reload
        expect(campaign.pcs.count).to eq(4)
      end

      it "deletes the requested NPC belonging to DM (rare)" do
        character = campaign.npcs.first
        delete "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested PC belonging to DM" do
        character = campaign.pcs.first
        delete "/v1/campaigns/#{campaign.slug}/player_characters/#{character.slug}.json"
        expect(response).to have_http_status(204)
        campaign.reload
        expect(campaign.pcs.count).to eq(4)
      end

      it "deletes the requested NPC belonging to DM" do
        character = campaign.npcs.first
        delete "/v1/campaigns/#{campaign.slug}/non_player_characters/#{character.slug}.json"
        expect(response).to have_http_status(204)
      end
    end
  end
end
