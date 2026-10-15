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
end
