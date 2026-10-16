require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::CampaignsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }
  let!(:campaign) { create(:campaign, user: user, name: 'The Grey Plague') }

  before { create(:patreon_user, :wizard, user_id: nil, linked_user: user) }

  describe 'GET /v1/foundry/campaigns' do
    it "lists the user's campaigns" do
      create(:campaign, name: 'Not mine')

      get '/v1/foundry/campaigns', headers: headers

      expect(response).to have_http_status(:success)
      expect(json).to contain_exactly(include('uuid' => campaign.uuid, 'name' => 'The Grey Plague'))
    end

    it 'needs premium access' do
      user.patreon_account.destroy!

      get '/v1/foundry/campaigns', headers: headers

      expect(response).to have_http_status(:forbidden)
      expect(json['code']).to eq('premium_required')
    end

    it 'needs a valid API token' do
      get '/v1/foundry/campaigns'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /v1/foundry/campaigns/:uuid/changes' do
    it 'returns the campaign changes since a cursor' do
      create(:campaign_npc, campaign: campaign, name: 'Vex')

      get "/v1/foundry/campaigns/#{campaign.uuid}/changes", params: { since: 0 }, headers: headers

      expect(response).to have_http_status(:success)
      expect(json['records']['npcs']).to contain_exactly(include('name' => 'Vex'))
      expect(json['cursor']).to eq(campaign.reload.sync_counter)
    end

    it "returns 404 for another user's campaign" do
      other = create(:campaign)

      get "/v1/foundry/campaigns/#{other.uuid}/changes", headers: headers

      expect(response).to have_http_status(:not_found)
    end

    it 'returns 404 for something that is not a uuid' do
      get '/v1/foundry/campaigns/the-grey-plague/changes', headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /v1/foundry/campaigns/:uuid/changes' do
    let(:front) { create(:campaign_front, campaign: campaign, clock_segments: 6) }

    it 'applies changes from Foundry' do
      post "/v1/foundry/campaigns/#{campaign.uuid}/changes",
           params: { changes: [{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                                 attributes: { clockFilled: 2 } }] },
           headers: headers, as: :json

      expect(response).to have_http_status(:success)
      expect(json['applied']).to contain_exactly(include('uuid' => front.uuid))
      expect(front.reload.clock_filled).to eq(2)
    end

    it 'rejects changes that are not a list' do
      post "/v1/foundry/campaigns/#{campaign.uuid}/changes", params: { changes: { type: 'front' } },
                                                             headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'needs premium access' do
      user.patreon_account.update!(has_premium: false)

      post "/v1/foundry/campaigns/#{campaign.uuid}/changes", params: { changes: [] }, headers: headers, as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'POST /v1/foundry/campaigns' do
    let(:brief) { { name: 'Zombie Siege', premise: 'The dead rise', start_level: 3, truths: ['The dead walk'] } }
    let(:akra) do
      { uuid: 'Actor.a1B2c3D4e5F6g7H8', name: 'Akra', playerName: 'Sam', level: 3,
        sheet: { summary: 'Level 3 Dragonborn Cleric' } }
    end
    let(:party) { { world: { id: 'greyhawk', title: 'Greyhawk' }, characters: [akra] } }

    it 'creates the campaign from the template and says how to find it' do
      post '/v1/foundry/campaigns', params: { template: 'three_act', campaign: brief }, headers: headers, as: :json

      expect(response).to have_http_status(:created)
      created = user.campaigns.find_by(name: 'Zombie Siege')
      expect(json).to include('uuid' => created.uuid, 'name' => 'Zombie Siege', 'mode' => 'arc',
                              'url' => "/app/campaigns/#{created.slug}", 'party' => [])
      expect(created.sessions.count).to eq(6)
      expect(created.truths).to eq(['The dead walk'])
    end

    it 'saves the party from the world and puts it in the campaign' do
      create(:player_character, user: user, world_id: 'greyhawk', name: 'Not chosen')

      post '/v1/foundry/campaigns', params: { template: 'blank', campaign: brief, party: party }, headers: headers,
                                    as: :json

      expect(json['party']).to eq(['Akra'])
      expect(user.player_characters.pluck(:name)).to contain_exactly('Akra', 'Not chosen')
    end

    it 'does not need premium' do
      user.patreon_account.destroy!

      post '/v1/foundry/campaigns', params: { template: 'sandbox', campaign: brief }, headers: headers, as: :json

      expect(response).to have_http_status(:created)
      expect(json['mode']).to eq('sandbox')
    end

    it 'returns the same campaign when a request is sent twice' do
      allow(Rails).to receive(:cache).and_return(ActiveSupport::Cache::MemoryStore.new)
      body = { template: 'blank', campaign: brief, request_id: 'abc12345-retry' }

      post '/v1/foundry/campaigns', params: body, headers: headers, as: :json
      first = json['uuid']
      post '/v1/foundry/campaigns', params: body, headers: headers, as: :json

      expect(response).to have_http_status(:ok)
      expect(json['uuid']).to eq(first)
      expect(user.campaigns.where(name: 'Zombie Siege').count).to eq(1)
    end

    it 'says which fields are wrong' do
      post '/v1/foundry/campaigns', params: { campaign: brief.merge(name: '', target_level: 1) }, headers: headers,
                                    as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['fields']).to contain_exactly('name', 'target_level')
      expect(json['errors']).to include("Name can't be blank")
    end

    it 'rejects more than six truths' do
      post '/v1/foundry/campaigns', params: { campaign: brief.merge(truths: Array.new(7) { |i| "Truth #{i}" }) },
                                    headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['fields']).to eq(['truths'])
    end

    it 'rejects an unknown template' do
      post '/v1/foundry/campaigns', params: { template: 'megadungeon', campaign: brief }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json).to eq('errors' => ['Unknown template'], 'fields' => ['template'])
    end

    it 'needs a valid API token' do
      post '/v1/foundry/campaigns', params: { campaign: brief }, as: :json

      expect(response).to have_http_status(:unauthorized)
      expect(Campaign.where(name: 'Zombie Siege')).to be_empty
    end
  end
end
