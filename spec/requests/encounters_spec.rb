require 'rails_helper'

RSpec.describe "Encounters", type: :request do
  let(:valid_attributes) do
    attributes_for(:encounter, name: 'Test Encounter - NEW', location: 'An awesome cave!')
  end
  let!(:race) { create :race, id: 1, name: 'Human'}

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:test_item) {
    create :item,
           id: 111112,
           name: 'Golden Ring'
  }
  let!(:test_monster) {
    create :monster,
           id: 111111,
           name: 'Orc',
           alignment: 'Chaotic Evil',
           armor_class: 13,
           hit_dice_number: 2,
           hit_dice_value: 8,
           hit_dice_modifier: 6,
           hit_points: 15,
           speed: '30 feet',
           strength: 16,
           dexterity: 12,
           constitution: 16,
           intelligence: 7,
           wisdom: 11,
           charisma: 10,
           challenge_rating: '1/2'
  }
  let!(:campaign) {
    create :campaign_with_assoc,
           user: dungeon_master,
           adventures_attributes: [
             {
               name: 'Test Adventure',
               description: 'An adventure for testing',
               encounters_attributes: [
                 {
                   copper_pieces: 10,
                   current_mob_index: 0,
                   description: 'The first room of the dungeon',
                   electrum_pieces: 10,
                   gold_pieces: 10,
                   in_progress: false,
                   location: 'Main door to the dungeons',
                   name: 'Ambush!',
                   platinum_pieces: 5,
                   round: 1,
                   silver_pieces: 10,
                   sort: 0,
                   encounter_items_attributes: [{
                       quantity: 3,
                       item_id: test_item.id
                     }],
                   encounter_monsters_attributes: [{
                       number_of_monsters: 3,
                       monster_id: test_monster.id
                     }]
                 }]
             }]
  }
  let!(:campaign_unowned) { create :campaign_with_assoc }

  before(:each) do
    @adventure = campaign.adventures.first
    @adventure.characters = campaign.pcs
    @adventure.encounters.each do |encounter|
      encounter.update_encounter
      encounter.save!
    end
    @encounter = @adventure.encounters.first
    @other_encounter = @adventure.encounters.sample
  end

  describe "GET /v1/campaigns/:campaign_slug/adventures/:id" do
    it "returns a success response" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
      expect(response).to have_http_status(200)
    end

    it "returns an error for forbidden" do
      get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
      result_items = JSON.parse(response.body)
      expect(result_items['errors']).to eq("User action not allowed.")
    end

    it "returns an Encounter" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
      result_item = JSON.parse(response.body)
      expect(result_item['combatants'].count).to eq(8)
      expect(result_item['name']).to eq('Ambush!')
      expect(result_item['description']).to eq('The first room of the dungeon')
    end
  end

  describe "GET /v1/campaigns/:campaign_slug/adventures/:id/edit" do

    it "returns a forbidden response" do
      sign_in dungeon_master
      get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}/edit"
      expect(response).to have_http_status(403)
    end
  end

  describe "POST /v1/campaigns/:campaign_slug/adventures/" do
    context "with valid params belonging to DM" do
      it "creates a new Encounter" do
        sign_in dungeon_master
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters.json",
               params: {encounter: valid_attributes}
        }.to change(Encounter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter - NEW')
      end

      it "returns an error for non-user creating Encounter" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters.json",
               params: {encounter: valid_attributes}
        }.to change(Encounter, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "PUT /v1/campaigns/:campaign_slug/adventures/:id" do
    context "with valid params" do
      it "updates the requested Encounter" do
        sign_in dungeon_master
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
              }
            }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter Edited')
      end

      it "returns an error for non-user editing" do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
              }
            }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "returns an error for non-admin editing" do
        encounter = campaign_unowned.adventures.first.encounters.first
        sign_in dungeon_master
        put "/v1/campaigns/#{campaign_unowned.slug}/adventures/#{campaign_unowned.adventures.first.id}/encounters/#{encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
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
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for non-user delete" do
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end
end
