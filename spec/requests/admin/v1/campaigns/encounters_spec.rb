require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::EncountersController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }
  let(:encounters_path) { "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}/encounters" }
  let(:encounter) { create(:campaign_encounter, quest: quest, name: 'Ambush') }
  let(:encounter_path) { "#{encounters_path}/#{encounter.id}" }
  let(:scenes) { [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }] }

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    describe 'GET .../encounters' do
      it "lists the quest's encounters in order, with their links" do
        later = create(:campaign_encounter, quest: quest, name: 'Lair', position: 1)
        encounter.update!(position: 0)
        create(:campaign_encounter_link, encounter: later, linkable: create(:monster, user: nil, name: 'Owlbear'), quantity: 2)
        create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign), name: 'Elsewhere')

        get encounters_path

        expect(response).to have_http_status(:success)
        expect(json.pluck('name')).to eq(%w[Ambush Lair])
        expect(json.last['links'].sole).to include('linkableType' => 'Monster', 'name' => 'Owlbear', 'quantity' => 2)
      end
    end

    describe 'GET .../encounters/:id' do
      it 'shows the encounter' do
        get encounter_path

        expect(response).to have_http_status(:success)
        expect(json).to include('id' => encounter.id.to_s, 'uuid' => encounter.uuid, 'questId' => quest.id.to_s, 'name' => 'Ambush',
                                'kind' => 'combat', 'position' => 0, 'foundryScenes' => [], 'rewardCurrency' => {},
                                'rewardXp' => nil, 'links' => [])
      end

      it "returns 404 for another quest's encounter" do
        other = create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))

        get "#{encounters_path}/#{other.id}"

        expect(response).to have_http_status(:not_found)
      end
    end

    describe 'POST .../encounters' do
      it 'adds an encounter to the quest, with its maps and reward' do
        expect do
          post encounters_path, params: { encounter: { name: 'Riddle door', kind: 'puzzle', description: 'Speak, friend',
                                                       notes: 'Mellon', position: 1, foundry_scenes: scenes,
                                                       reward_currency: { gp: '25' }, reward_xp: 200 } }, as: :json
        end.to change(quest.encounters, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json).to include('name' => 'Riddle door', 'kind' => 'puzzle', 'description' => 'Speak, friend', 'notes' => 'Mellon',
                                'position' => 1, 'foundryScenes' => scenes, 'rewardCurrency' => { 'gp' => 25 }, 'rewardXp' => 200,
                                'questId' => quest.id.to_s)
        created = CampaignEncounter.find(json['id'])
        expect(created).to have_attributes(campaign: campaign, quest: quest, uuid: json['uuid'])
        expect(created.sync_version).to eq(campaign.reload.sync_counter)
      end

      it "can't put it in another campaign or quest" do
        elsewhere = create(:campaign_quest, campaign: create(:campaign, user: user))

        post encounters_path, params: { encounter: { name: 'Ambush', campaign_id: elsewhere.campaign_id, quest_id: elsewhere.id } },
                              as: :json

        expect(CampaignEncounter.find(json['id'])).to have_attributes(campaign: campaign, quest: quest)
      end

      it 'returns validation errors' do
        expect do
          post encounters_path, params: { encounter: { name: '', kind: 'brawl', reward_currency: { gp: -1 } } }, as: :json
        end.not_to change(CampaignEncounter, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include("Name can't be blank", 'Kind is not included in the list', /Reward currency must be/)
      end

      it "returns 404 for a quest from the DM's other campaign" do
        elsewhere = create(:campaign_quest, campaign: create(:campaign, user: user))

        post "/v1/campaigns/#{campaign.slug}/quests/#{elsewhere.id}/encounters", params: { encounter: { name: 'Ambush' } }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(CampaignEncounter.count).to eq(0)
      end
    end

    describe 'PATCH .../encounters/:id' do
      it 'changes the encounter and bumps its sync version' do
        version = encounter.sync_version

        patch encounter_path, params: { encounter: { name: 'Bandits', kind: 'social', position: 3, reward_xp: nil } }, as: :json

        expect(response).to have_http_status(:success)
        expect(json).to include('name' => 'Bandits', 'kind' => 'social', 'position' => 3)
        expect(encounter.reload.sync_version).to be > version
      end

      it 'returns validation errors' do
        patch encounter_path, params: { encounter: { foundry_scenes: [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Vex' }] } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(/Foundry scenes must be/)
      end
    end

    describe 'DELETE .../encounters/:id' do
      it 'deletes the encounter and its links, leaving a tombstone for the encounter' do
        create(:campaign_encounter_link, encounter: encounter)

        expect { delete encounter_path }.to change(CampaignTombstone, :count).by(1)

        expect(response).to have_http_status(:no_content)
        expect(CampaignEncounter.exists?(encounter.id)).to be false
        expect(CampaignEncounterLink.count).to eq(0)
        expect(CampaignTombstone.last).to have_attributes(campaign_id: campaign.id, record_type: 'CampaignEncounter',
                                                          record_uuid: encounter.uuid)
      end
    end
  end

  context "with another user's campaign" do
    before do
      encounter
      stub_authentication(create(:dungeon_master_user))
    end

    it 'responds 404 to every action and changes nothing' do
      get encounters_path
      expect(response).to have_http_status(:not_found)

      get encounter_path
      expect(response).to have_http_status(:not_found)

      post encounters_path, params: { encounter: { name: 'Mine now' } }, as: :json
      expect(response).to have_http_status(:not_found)

      patch encounter_path, params: { encounter: { name: 'Mine now' } }, as: :json
      expect(response).to have_http_status(:not_found)

      delete encounter_path
      expect(response).to have_http_status(:not_found)

      expect(CampaignEncounter.pluck(:name)).to eq(['Ambush'])
    end
  end

  context 'when not authenticated' do
    before do
      encounter
      stub_no_auth
    end

    it 'responds 401 to every action and changes nothing' do
      get encounters_path
      expect(response).to have_http_status(:unauthorized)

      post encounters_path, params: { encounter: { name: 'Mine now' } }, as: :json
      expect(response).to have_http_status(:unauthorized)

      patch encounter_path, params: { encounter: { name: 'Mine now' } }, as: :json
      expect(response).to have_http_status(:unauthorized)

      delete encounter_path
      expect(response).to have_http_status(:unauthorized)

      expect(CampaignEncounter.pluck(:name)).to eq(['Ambush'])
    end
  end
end
