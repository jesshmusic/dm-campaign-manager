require 'rails_helper'

RSpec.describe 'Admin::V1::CampaignsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:other_user) { create(:dungeon_master_user) }
  let!(:campaign) { create(:campaign, user: user, name: 'Lost Mine') }
  let!(:other_campaign) { create(:campaign, user: other_user, name: 'Not Mine') }

  describe 'GET /v1/campaigns' do
    before { stub_authentication(user) }

    it "lists only the signed-in user's campaigns" do
      get '/v1/campaigns'

      expect(response).to have_http_status(:success)
      expect(json.pluck('name')).to eq(['Lost Mine'])
    end

    it 'puts the most recently updated campaign first' do
      newer = create(:campaign, user: user, name: 'Newer', updated_at: 1.minute.from_now)

      get '/v1/campaigns'

      expect(json.pluck('id')).to eq([newer.id.to_s, campaign.id.to_s])
    end

    it 'summarizes sessions and clocks' do
      create(:campaign_session, campaign: campaign, number: 1, status: 'played')
      upcoming = create(:campaign_session, campaign: campaign, number: 2, title: 'Wave Echo Cave')
      front = create(:campaign_front, campaign: campaign, name: 'Black Spider', clock_segments: 6, clock_filled: 2)

      get '/v1/campaigns'

      expect(json.first).to include(
        'slug' => 'lost-mine',
        'sessionCount' => 2,
        'nextSession' => include('id' => upcoming.id.to_s, 'number' => 2, 'displayTitle' => 'Wave Echo Cave'),
        'clocks' => [{ 'id' => front.id.to_s, 'name' => 'Black Spider', 'clockSegments' => 6, 'clockFilled' => 2 }]
      )
      expect(json.first).not_to have_key('sessions')
    end

    it 'returns an empty list for a new DM' do
      stub_authentication(create(:dungeon_master_user))

      get '/v1/campaigns'

      expect(json).to eq([])
    end
  end

  describe 'GET /v1/campaigns/:id' do
    before { stub_authentication(user) }

    it 'returns the full campaign by slug' do
      create(:campaign_faction, campaign: campaign, name: 'Redbrands')
      create(:campaign_location, campaign: campaign, name: 'Phandalin')
      npc = create(:campaign_npc, campaign: campaign, name: 'Glasstaff')
      create(:campaign_front, campaign: campaign, name: 'Black Spider')
      create(:campaign_quest, campaign: campaign, name: 'Find Gundren')
      create(:campaign_secret, campaign: campaign, revelation: 'Glasstaff is Iarno', revealed: true)
      create(:campaign_secret, campaign: campaign, revelation: 'Glasstaff is Iarno')
      session = create(:campaign_session, campaign: campaign, title: 'Goblin Arrows')
      create(:campaign_session_link, session: session, linkable: npc)

      get "/v1/campaigns/#{campaign.slug}"

      expect(response).to have_http_status(:success)
      expect(json).to include('id' => campaign.id.to_s, 'uuid' => campaign.uuid, 'name' => 'Lost Mine')
      expect(json['factions'].pluck('name')).to eq(['Redbrands'])
      expect(json['locations'].pluck('name')).to eq(['Phandalin'])
      expect(json['npcs'].pluck('name')).to eq(['Glasstaff'])
      expect(json['fronts'].pluck('name')).to eq(['Black Spider'])
      expect(json['quests'].pluck('name')).to eq(['Find Gundren'])
      expect(json['secrets'].size).to eq(2)
      expect(json['sessions'].sole).to include('title' => 'Goblin Arrows')
      expect(json['sessions'].sole['links'].sole).to include('linkableType' => 'CampaignNpc', 'name' => 'Glasstaff')
      expect(json['revelations']).to eq([{ 'name' => 'Glasstaff is Iarno', 'clueCount' => 2, 'revealedCount' => 1 }])
    end

    it "includes thumbnails of the Foundry scenes it uses as maps, from the DM's own scenes" do
      pass = create(:foundry_scene, user: user, name: 'Mountain Pass')
      camp = create(:foundry_scene, user: user, name: 'Camp')
      create(:foundry_scene, user: user, name: 'Unused')
      create(:foundry_scene, user: other_user, foundry_uuid: 'Scene.zzzzzzzzzzzzzzzz')
      create(:campaign_location, campaign: campaign, foundry_scene_uuid: pass.foundry_uuid, foundry_scene_name: 'Pass')
      create(:campaign_session, campaign: campaign, foundry_scenes: [
               { 'uuid' => camp.foundry_uuid, 'name' => 'Camp' }, { 'uuid' => 'Scene.zzzzzzzzzzzzzzzz', 'name' => 'Not sent' }
             ])
      lair = create(:foundry_scene, user: user, name: 'Lair')
      create(:campaign_quest, campaign: campaign, foundry_scenes: [{ 'uuid' => lair.foundry_uuid, 'name' => 'Lair' }])

      get "/v1/campaigns/#{campaign.slug}"

      expect(json['sceneThumbnails']).to eq(pass.foundry_uuid => pass.thumbnail_url, camp.foundry_uuid => camp.thumbnail_url,
                                            lair.foundry_uuid => lair.thumbnail_url)
    end

    it 'includes each quest with its maps, reward and links' do
      quest = create(:campaign_quest, campaign: campaign, name: 'Find Gundren', reward_currency: { gp: 50 }, milestone: true)
      create(:campaign_quest_link, quest: quest, linkable: create(:campaign_npc, campaign: campaign, name: 'Sildar'))

      get "/v1/campaigns/#{campaign.slug}"

      expect(json['quests'].sole).to include('name' => 'Find Gundren', 'rewardCurrency' => { 'gp' => 50 }, 'milestone' => true,
                                             'rewardXp' => nil, 'foundryScenes' => [])
      expect(json['quests'].sole['links'].sole).to include('linkableType' => 'CampaignNpc', 'name' => 'Sildar')
    end

    it 'also finds the campaign by id' do
      get "/v1/campaigns/#{campaign.id}"

      expect(json['slug']).to eq('lost-mine')
    end

    it "returns the user's own campaign when another DM uses the same slug" do
      create(:campaign, user: other_user, name: 'Lost Mine')

      get '/v1/campaigns/lost-mine'

      expect(json['id']).to eq(campaign.id.to_s)
    end

    it "returns 404 for another user's campaign" do
      get "/v1/campaigns/#{other_campaign.slug}"

      expect(response).to have_http_status(:not_found)
      expect(json['errors']).to eq(['Campaign not found'])

      get "/v1/campaigns/#{other_campaign.id}"
      expect(response).to have_http_status(:not_found)
    end

    it 'returns 404 for an unknown campaign' do
      get '/v1/campaigns/nope'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /v1/campaigns' do
    before { stub_authentication(user) }

    let(:campaign_params) do
      { name: 'Storm King', premise: 'Giants are restless', mode: 'arc', planned_sessions: 4, start_level: 5,
        target_level: 8, party_size: 4, tone: 'Epic', edition: '2014', truths: ['Giants rule the north', 'Dragons hide'] }
    end

    it 'creates a blank campaign' do
      expect do
        post '/v1/campaigns', params: { campaign: campaign_params }
      end.to change(user.campaigns, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json).to include(
        'name' => 'Storm King', 'slug' => 'storm-king', 'premise' => 'Giants are restless', 'plannedSessions' => 4,
        'startLevel' => 5, 'targetLevel' => 8, 'partySize' => 4, 'edition' => '2024', 'status' => 'planning',
        'truths' => ['Giants rule the north', 'Dragons hide'], 'sessions' => [], 'quests' => [], 'fronts' => [],
        'revelations' => []
      )
      expect(json['uuid']).to be_present
    end

    it 'always uses the 2024 rules, ignoring a requested edition' do
      post '/v1/campaigns', params: { campaign: campaign_params }

      expect(user.campaigns.last.edition).to eq('2024')
    end

    it 'starts with the chosen party' do
      akra = create(:player_character, user: user, name: 'Akra')
      not_mine = create(:player_character, name: 'Not mine')

      post '/v1/campaigns', params: { campaign: campaign_params.merge(party_character_ids: [akra.id, not_mine.id]) },
                            as: :json

      expect(response).to have_http_status(:created)
      expect(json['party'].pluck('name')).to eq(['Akra'])
      expect(json['party'].first['sheet']).to include('summary' => 'Level 3 Dragonborn Cleric')
    end

    it 'treats an empty template as blank' do
      post '/v1/campaigns', params: { campaign: campaign_params, template: '' }

      expect(response).to have_http_status(:created)
      expect(json['sessions']).to eq([])
    end

    it 'applies a template' do
      post '/v1/campaigns', params: { campaign: campaign_params, template: 'three_act' }

      expect(response).to have_http_status(:created)
      expect(json['sessions'].map { |s| [s['number'], s['level']] }).to eq([[1, 5], [2, 6], [3, 7], [4, 8]])
      expect(json['quests'].pluck('name')).to eq(CampaignTemplate::ACTS)
      expect(json['fronts'].sole).to include('name' => 'Main threat', 'clockSegments' => 4)
    end

    it 'applies the five-room template' do
      post '/v1/campaigns', params: { campaign: campaign_params.merge(mode: 'oneshot'), template: 'five_room' }

      expect(response).to have_http_status(:created)
      expect(json['sessions'].sole['scenes']).to eq(CampaignTemplate::FIVE_ROOMS)
    end

    it 'rejects an unknown template without creating anything' do
      expect do
        post '/v1/campaigns', params: { campaign: campaign_params, template: 'mega_dungeon' }
      end.not_to change(Campaign, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['Unknown template'])
    end

    it 'returns validation errors' do
      expect do
        post '/v1/campaigns', params: { campaign: { name: '', start_level: 10, target_level: 2 } }
      end.not_to change(Campaign, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include("Name can't be blank", "Target level can't be lower than the starting level")
    end

    it 'rolls back the campaign when the template fails' do
      allow(CampaignTemplate).to receive(:apply!).and_raise(ActiveRecord::RecordInvalid.new(CampaignSession.new))

      expect do
        post '/v1/campaigns', params: { campaign: campaign_params, template: 'three_act' }
      end.not_to change(Campaign, :count)

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'ignores attempts to set the owner or sync fields' do
      post '/v1/campaigns', params: { campaign: campaign_params.merge(user_id: other_user.id, sync_version: 99, uuid: 'x') }

      created = Campaign.find(json['id'])
      expect(created.user).to eq(user)
      expect(created.sync_version).to eq(0)
      expect(created.uuid).not_to eq('x')
    end
  end

  describe 'PATCH /v1/campaigns/:id' do
    before { stub_authentication(user) }

    it 'updates the campaign and bumps its sync version' do
      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { status: 'active', pitch: 'Find the mine' } }

      expect(response).to have_http_status(:success)
      expect(json).to include('status' => 'active', 'pitch' => 'Find the mine', 'slug' => 'lost-mine')
      expect(json).not_to have_key('sessions')
      expect(campaign.reload.sync_version).to be_positive
    end

    it 'sets the party' do
      akra = create(:player_character, user: user, name: 'Akra')
      borin = create(:player_character, user: user, name: 'Borin')
      campaign.assign_party!([akra.id])

      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { party_character_ids: [borin.id.to_s] } }, as: :json

      expect(response).to have_http_status(:success)
      expect(campaign.party.reload).to eq([borin])
    end

    it 'leaves the party alone when the request does not set it' do
      akra = create(:player_character, user: user)
      campaign.assign_party!([akra.id])

      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { pitch: 'New pitch' } }, as: :json

      expect(campaign.party.reload).to eq([akra])
    end

    it 'saves the compendiums the campaign leaves out' do
      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { excluded_compendium_packs: ['dnd5e.actors24'] } },
                                              as: :json

      expect(response).to have_http_status(:success)
      expect(json['excludedCompendiumPacks']).to eq(['dnd5e.actors24'])

      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { excluded_compendium_packs: [] } }, as: :json

      expect(campaign.reload.excluded_compendium_packs).to eq([])
    end

    it 'returns validation errors' do
      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { mode: 'megadungeon' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Mode is not included in the list')
      expect(campaign.reload.mode).to eq('arc')
    end

    it "returns 404 for another user's campaign" do
      patch "/v1/campaigns/#{other_campaign.slug}", params: { campaign: { name: 'Hijacked' } }

      expect(response).to have_http_status(:not_found)
      expect(other_campaign.reload.name).to eq('Not Mine')
    end
  end

  describe 'DELETE /v1/campaigns/:id' do
    before { stub_authentication(user) }

    it 'deletes the campaign and everything in it' do
      create(:campaign_session, campaign: campaign)
      create(:campaign_npc, campaign: campaign)

      delete "/v1/campaigns/#{campaign.slug}"

      expect(response).to have_http_status(:no_content)
      expect(Campaign.exists?(campaign.id)).to be false
      expect(CampaignSession.count + CampaignNpc.count + CampaignTombstone.count).to eq(0)
    end

    it "returns 404 for another user's campaign" do
      delete "/v1/campaigns/#{other_campaign.slug}"

      expect(response).to have_http_status(:not_found)
      expect(Campaign.exists?(other_campaign.id)).to be true
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'returns 401 for every action' do
      get '/v1/campaigns'
      expect(response).to have_http_status(:unauthorized)

      get "/v1/campaigns/#{campaign.slug}"
      expect(response).to have_http_status(:unauthorized)

      post '/v1/campaigns', params: { campaign: { name: 'Sneaky' } }
      expect(response).to have_http_status(:unauthorized)

      patch "/v1/campaigns/#{campaign.slug}", params: { campaign: { name: 'Sneaky' } }
      expect(response).to have_http_status(:unauthorized)

      delete "/v1/campaigns/#{campaign.slug}"
      expect(response).to have_http_status(:unauthorized)

      expect(Campaign.count).to eq(2)
      expect(campaign.reload.name).to eq('Lost Mine')
    end
  end

  context 'when the token has no matching user' do
    before do
      auth_service = instance_double(AuthorizationService, authenticate_request!: true, get_current_user: nil)
      allow(AuthorizationService).to receive(:new).and_return(auth_service)
    end

    it 'returns 401' do
      get '/v1/campaigns'

      expect(response).to have_http_status(:unauthorized)
      expect(json['errors']).to eq(['Not Authenticated'])
    end
  end
end
