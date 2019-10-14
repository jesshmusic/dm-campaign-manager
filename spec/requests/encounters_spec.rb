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
    @campaign_pc = @adventure.pcs.first
    @campaign_npc = campaign.npcs.first
    @campaign_npc.name = 'Andrade Mirrius'
    @campaign_npc.save!
    @encounter.encounter_npcs << EncounterNpc.create(character: @campaign_npc, is_combatant: true)
    @encounter.update_encounter
    @encounter.save!
    @encounter.reload
    @encounter_combatant_pc = @encounter.encounter_combatants.find { |encounter_combatant|
      encounter_combatant.character&.id == @campaign_pc.id
    }
    @encounter_combatant_npc = @encounter.encounter_combatants.find { |encounter_combatant|
      encounter_combatant.character&.id == @campaign_npc.id
    }
    @other_encounter = @adventure.encounters.sample
  end

  describe "GET single Encounter" do
    context "for Logged Out Users" do
      it "returns an error for forbidden" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_items = JSON.parse(response.body)
        expect(result_items['errors']).to eq("User action not allowed.")
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        expect(response).to have_http_status(200)
      end

      it "returns an Encounter" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['combatants'].count).to eq(9)
        expect(result_item['name']).to eq('Ambush!')
        expect(result_item['description']).to eq('The first room of the dungeon')
      end

      it "should have EncounterCombatants with proper fields" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_item = JSON.parse(response.body)
        combatants = result_item['combatants']
        expect(combatants.first['name']).not_to be_nil
        expect(combatants.first['combatant']).not_to be_nil
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        expect(response).to have_http_status(200)
      end

      it "returns an Encounter" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['combatants'].count).to eq(9)
        expect(result_item['name']).to eq('Ambush!')
        expect(result_item['description']).to eq('The first room of the dungeon')
      end
    end
  end

  describe "GET Encounter Edit Page (admin only)" do
    context "for Logged Out Users" do

      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}/edit"
        expect(response).to have_http_status(403)
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "returns a success response" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}/edit"
        expect(response).to have_http_status(200)
      end

    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "returns a forbidden response" do
        get "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}/edit"
        expect(response).to have_http_status(403)
      end
    end

  end

  describe "POST Create Encounter" do
    context "for Logged Out Users" do
      it "returns an error for non-user creating Encounter" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters.json",
               params: {encounter: valid_attributes}
        }.to change(Encounter, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "creates a new Encounter" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters.json",
               params: {encounter: valid_attributes}
        }.to change(Encounter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter - NEW')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "creates a new Encounter" do
        expect {
          post "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters.json",
               params: {encounter: valid_attributes}
        }.to change(Encounter, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter - NEW')
      end
    end
  end

  describe "PUT Encounter Tracker" do
    before(:each) do
      sign_in dungeon_master
    end

    context "Encounter Tracker stats and order" do
      it "Starts the Encounter, returns correct `encounterState`" do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
              },
              encounter_tracker: true,
            }
        @encounter.reload
        expect(@encounter.in_progress).to eq(true)
        result_item = JSON.parse(response.body)
        expect(result_item['encounterState'].keys)
          .to contain_exactly('currentCombatant', 'inProgress', 'round')
        expect(result_item['encounterState']['inProgress'])
          .to eq(true)
        expect(result_item['encounterState']['currentCombatant'])
          .to eq(0)
        expect(result_item['encounterState']['round'])
          .to eq(1)
      end

      it "Increments combatants past last, sets to zero and increments round in result" do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                current_mob_index: @encounter.encounter_combatants.count,
                in_progress: true,
              },
              encounter_tracker: true,
            }
        @encounter.reload
        expect(@encounter.in_progress).to eq(true)
        result_item = JSON.parse(response.body)
        expect(result_item['encounterState'].keys)
          .to contain_exactly('currentCombatant', 'inProgress', 'round')
        expect(result_item['encounterState']['inProgress'])
          .to eq(true)
        expect(result_item['encounterState']['currentCombatant'])
          .to eq(0)
        expect(result_item['encounterState']['round'])
          .to eq(2)
      end

      it "Sorts combatants by initiative" do
        new_initiatives = [20, 5, 19, 6, 22, 7, 17, 8, 5]
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
                encounter_combatants_attributes: @encounter.encounter_combatants.map.with_index { |combatant, index|
                  {
                    id: combatant.id,
                    notes: "Combatant initiative: #{new_initiatives[index]}",
                    initiative_roll: new_initiatives[index],
                  }
                }
              },
              encounter_tracker: true,
            }
        @encounter.reload
        expect(@encounter.in_progress).to eq(true)
        result_item = JSON.parse(response.body)
        expect(result_item['combatants'][0]['notes'])
          .to eq('Combatant initiative: 22')
        expect(result_item['combatants'][0]['initiativeRoll'])
          .to eq(22)
        expect(result_item['combatants'][1]['notes'])
          .to eq('Combatant initiative: 20')
        expect(result_item['combatants'][1]['initiativeRoll'])
          .to eq(20)
        expect(result_item['combatants'][2]['notes'])
          .to eq('Combatant initiative: 19')
        expect(result_item['combatants'][2]['initiativeRoll'])
          .to eq(19)
      end
    end

    context 'PC Encounter Damage' do
      before(:each) do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
                encounter_combatants_attributes: [{
                                                    id: @encounter_combatant_pc.id,
                                                    current_hit_points: @campaign_pc.hit_points - 1
                                                  }]
              },
              encounter_tracker: true,
            }
        @campaign_pc.reload
        @encounter_combatant_pc.reload
      end

      it 'should reflect damage on player character records in addition to EncounterCombatant' do
        expect(@encounter_combatant_pc.current_hit_points).to eq(@campaign_pc.hit_points - 1)
        expect(@campaign_pc.hit_points_current).to eq(@encounter_combatant_pc.current_hit_points)
        expect(@campaign_pc.hit_points_current).to eq(@campaign_pc.hit_points - 1)
      end

      it 'should not have a status of "dead"' do
        expect(@campaign_pc.status).not_to eq('dead')
      end
    end

    context 'PC Encounter Death' do
      before(:each) do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
                encounter_combatants_attributes: [{
                                                    id: @encounter_combatant_pc.id,
                                                    current_hit_points: 0
                                                  }]
              },
              encounter_tracker: true,
            }
        @campaign_pc.reload
      end

      it 'should change status to "dead" on player character' do
        expect(@campaign_pc.status).to eq('dead')
        expect(@campaign_pc.hit_points_current).to eq(0)
      end
    end

    context 'NPC Encounter Damage' do
      before(:each) do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
                encounter_combatants_attributes: [{
                                                    id: @encounter_combatant_npc.id,
                                                    current_hit_points: @campaign_npc.hit_points - 10
                                                  }]
              },
              encounter_tracker: true,
            }
        @campaign_npc.reload
        @encounter_combatant_npc.reload
      end

      it 'should reflect damage on non-player character records in addition to EncounterCombatant' do
        expect(@encounter_combatant_npc.current_hit_points).to eq(@campaign_npc.hit_points - 10)
        expect(@campaign_npc.hit_points_current).to eq(@encounter_combatant_npc.current_hit_points)
        expect(@campaign_npc.hit_points_current).to eq(@campaign_npc.hit_points - 10)
      end

      it 'should not have a status of "dead"' do
        expect(@campaign_pc.status).not_to eq('dead')
      end
    end

    context 'NPC Encounter Death' do
      before(:each) do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                in_progress: true,
                encounter_combatants_attributes: [{
                                                    id: @encounter_combatant_npc.id,
                                                    current_hit_points: 0
                                                  }]
              },
              encounter_tracker: true,
            }
        @campaign_npc.reload
      end

      it 'should change status to "dead" on non-player character' do
        expect(@campaign_npc.status).to eq('dead')
        expect(@campaign_npc.hit_points_current).to eq(0)
      end
    end
  end

  describe "PUT Update Encounter" do
    context "for Logged Out Users" do
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
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "updates the requested Encounter" do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
              }
            }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter Edited')
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "updates the requested Encounter" do
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
              }
            }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Encounter Edited')
      end

      it "returns an error for editing someone else's encounter" do
        encounter = campaign_unowned.adventures.first.encounters.first
        put "/v1/campaigns/#{campaign_unowned.slug}/adventures/#{campaign_unowned.adventures.first.id}/encounters/#{encounter.id}.json",
            params: {
              encounter: {
                name: 'Test Encounter Edited',
              }
            }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end

      it "should add an NPC to the encounter that is not a combatant" do
        new_encounter_npc = campaign.npcs.first
        old_combatants_count = @encounter.encounter_combatants.count
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                encounter_npcs_attributes: [{
                  character_id: new_encounter_npc.id,
                }]
              }
            }
        @encounter.reload
        expect(@encounter.encounter_combatants.count).to eq(old_combatants_count)
      end

      it "should add an NPC to the encounter that IS a combatant" do
        new_encounter_npc = campaign.npcs.first
        old_combatants_count = @encounter.encounter_combatants.count
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                encounter_npcs_attributes: [{
                                              character_id: new_encounter_npc.id,
                                              is_combatant: true,
                                            }]
              }
            }
        @encounter.reload
        expect(@encounter.encounter_combatants.count).to eq(old_combatants_count + 1)
      end

      it "should change a non-combatant NPC to a combatant_NPC" do
        new_encounter_npc = campaign.npcs.first
        old_combatants_count = @encounter.encounter_combatants.count
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                encounter_npcs_attributes: [{
                                              character_id: new_encounter_npc.id,
                                            }]
              }
            }
        @encounter.reload
        expect(@encounter.encounter_combatants.count).to eq(old_combatants_count)
        put "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json",
            params: {
              encounter: {
                encounter_npcs_attributes: [{
                                              character_id: new_encounter_npc.id,
                                              is_combatant: true,
                                            }]
              }
            }
        @encounter.reload
        expect(@encounter.encounter_combatants.count).to eq(old_combatants_count + 1)
      end
    end
  end

  describe "DELETE Delete Encounter" do
    context "for Logged Out Users" do
      it "returns an error for non-user delete" do
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end

    context "for Admins" do
      before(:each) do
        sign_in admin
      end

      it "deletes the requested item belonging to DM (rare)" do
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        expect(response).to have_http_status(204)
      end
    end

    context "for Dungeon Masters" do
      before(:each) do
        sign_in dungeon_master
      end

      it "deletes the requested item belonging to DM" do
        delete "/v1/campaigns/#{campaign.slug}/adventures/#{@adventure.id}/encounters/#{@encounter.id}.json"
        expect(response).to have_http_status(204)
      end
    end
  end
end
