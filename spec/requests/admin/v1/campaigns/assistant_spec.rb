require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::AssistantController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user, name: 'Shattered Crown') }
  let(:other_campaign) { create(:campaign, user: create(:dungeon_master_user), name: 'Not Mine') }
  let(:base_path) { "/v1/campaigns/#{campaign.slug}" }
  let(:outline_path) { "#{base_path}/assistant/outline" }
  let(:apply_path) { "#{base_path}/assistant/apply" }
  let(:planner_session) { create(:campaign_session, campaign: campaign, title: 'The Frozen Pass', log: 'The party unmasked Vex.') }
  let(:prep_path) { "#{base_path}/sessions/#{planner_session.id}/assistant/prep" }
  let(:recap_path) { "#{base_path}/sessions/#{planner_session.id}/assistant/recap" }
  let(:reply) { {}.to_json }
  let(:ai_client) { instance_double(OpenAIClient, completions: reply) }

  before do
    stub_authentication(user)
    allow(OpenAIClient).to receive(:for).and_return(ai_client)
  end

  describe 'POST /v1/campaigns/:campaign_id/assistant/outline' do
    let(:reply) { { 'pitch' => 'Find the crown', 'factions' => [{ 'name' => 'Iron Hand' }] }.to_json }

    it 'returns the proposed outline without saving it' do
      expect { post outline_path, as: :json }.not_to change(CampaignFaction, :count)

      expect(response).to have_http_status(:ok)
      expect(json).to eq('pitch' => 'Find the crown', 'factions' => [{ 'name' => 'Iron Hand' }])
      expect(OpenAIClient).to have_received(:for).with(user)
      expect(ai_client).to have_received(:completions).with(
        hash_including(system: CampaignAssistant::SYSTEM_PROMPT, json_schema: CampaignAssistantSchemas::OUTLINE,
                       prompt: a_string_including('Campaign: Shattered Crown'))
      )
      expect(campaign.reload.pitch).to be_nil
    end

    it 'finds the campaign by id as well as slug' do
      post "/v1/campaigns/#{campaign.id}/assistant/outline", as: :json

      expect(response).to have_http_status(:ok)
    end

    it "returns 404 for another user's campaign" do
      post "/v1/campaigns/#{other_campaign.slug}/assistant/outline", as: :json

      expect(response).to have_http_status(:not_found)
      expect(json['errors']).to eq(['Not found'])
      expect(OpenAIClient).not_to have_received(:for)
    end

    context 'when the user has no OpenAI key and no premium' do
      before { allow(OpenAIClient).to receive(:for).and_call_original }

      it 'returns 403 with the no_ai_key code' do
        post outline_path, as: :json

        expect(response).to have_http_status(:forbidden)
        expect(json).to eq(
          'errors' => ['Add your OpenAI API key in your dashboard, or join Patreon for hosted AI.'], 'code' => 'no_ai_key'
        )
      end
    end

    context 'when the user has their own OpenAI key' do
      before do
        allow(OpenAIClient).to receive(:for).and_call_original
        allow(OpenAIClient).to receive(:new).and_return(ai_client)
        user.update!(openai_api_key: "sk-#{'k' * 30}")
      end

      it 'uses it' do
        post outline_path, as: :json

        expect(response).to have_http_status(:ok)
        expect(OpenAIClient).to have_received(:new).with(api_key: "sk-#{'k' * 30}")
      end
    end

    context 'when OpenAI fails' do
      before { allow(ai_client).to receive(:completions).and_raise(OpenAIClient::Error, 'Rate limit reached') }

      it 'returns 502' do
        post outline_path, as: :json

        expect(response).to have_http_status(:bad_gateway)
        expect(json['errors']).to eq(['The AI service failed: Rate limit reached'])
      end
    end

    context 'when the AI reply is not JSON' do
      let(:reply) { 'Sure! Here is a plan.' }

      it 'returns 422' do
        post outline_path, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['The AI returned something unreadable. Please try again.'])
      end
    end
  end

  describe 'POST /v1/campaigns/:campaign_id/sessions/:session_id/assistant/prep' do
    let(:reply) { { 'items' => ['Avalanche', 'Ice bridge'] }.to_json }

    it 'returns suggestions for the step' do
      post prep_path, params: { step: 'scenes' }, as: :json

      expect(response).to have_http_status(:ok)
      expect(json).to eq('items' => ['Avalanche', 'Ice bridge'])
      expect(ai_client).to have_received(:completions).with(
        hash_including(prompt: a_string_including('Session 1: The Frozen Pass', '"items": 3-5 short possible scenes'))
      )
    end

    it 'returns 422 for an unknown step' do
      post prep_path, params: { step: 'treasure' }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['Unknown prep step: treasure'])
      expect(ai_client).not_to have_received(:completions)
    end

    it 'returns 422 without a step' do
      post prep_path, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(ai_client).not_to have_received(:completions)
    end

    it 'returns 404 for a session in another of the user\'s campaigns' do
      elsewhere = create(:campaign_session, campaign: create(:campaign, user: user))

      post "#{base_path}/sessions/#{elsewhere.id}/assistant/prep", params: { step: 'scenes' }, as: :json

      expect(response).to have_http_status(:not_found)
      expect(ai_client).not_to have_received(:completions)
    end

    it "returns 404 for another user's campaign" do
      foreign = create(:campaign_session, campaign: other_campaign)

      post "/v1/campaigns/#{other_campaign.slug}/sessions/#{foreign.id}/assistant/prep", params: { step: 'scenes' }, as: :json

      expect(response).to have_http_status(:not_found)
      expect(ai_client).not_to have_received(:completions)
    end
  end

  describe 'POST /v1/campaigns/:campaign_id/sessions/:session_id/assistant/recap' do
    let!(:secret) { create(:campaign_secret, campaign: campaign, text: 'Vex serves the usurper') }
    let(:foreign_secret) { create(:campaign_secret, campaign: other_campaign) }
    let(:reply) do
      { recap: 'Vex was unmasked.', revealed_secret_ids: [secret.id, foreign_secret.id], clock_advances: [],
        quest_updates: [] }.to_json
    end

    it "returns the recap with only this campaign's changes, without saving them" do
      post recap_path, as: :json

      expect(response).to have_http_status(:ok)
      expect(json).to eq('recap' => 'Vex was unmasked.', 'revealed_secret_ids' => [secret.id], 'clock_advances' => [],
                         'quest_updates' => [])
      expect(secret.reload).not_to be_revealed
      expect(planner_session.reload.recap).to be_nil
    end

    it 'returns 422 when the session has no log' do
      unlogged = create(:campaign_session, campaign: campaign)

      post "#{base_path}/sessions/#{unlogged.id}/assistant/recap", as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['Write a session log first.'])
      expect(ai_client).not_to have_received(:completions)
    end

    it 'returns 404 for a session in another campaign' do
      foreign = create(:campaign_session, campaign: other_campaign, log: 'Their secrets')

      post "#{base_path}/sessions/#{foreign.id}/assistant/recap", as: :json

      expect(response).to have_http_status(:not_found)
      expect(ai_client).not_to have_received(:completions)
    end
  end

  describe 'POST /v1/campaigns/:campaign_id/assistant/apply' do
    let(:outline) do
      {
        pitch: 'Find the crown',
        factions: [{ name: 'Iron Hand' }],
        npcs: [{ name: 'Vex', role: 'bbeg', faction: 'iron hand' }],
        quests: [{ name: 'Recover the crown', kind: 'main', act: 1, giver: 'Vex' }],
        secrets: [{ revelation: 'Vex lies', text: 'A forged letter' }]
      }
    end

    it 'rejects an outline that is not an object' do
      stub_authentication(user)

      post apply_path, params: { outline: %w[not an object] }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body['errors']).to eq(['Outline must be an object'])
    end

    it 'saves the approved sections and returns the full campaign' do
      post apply_path, params: { outline: outline, sections: %w[pitch factions npcs] }, as: :json

      expect(response).to have_http_status(:ok)
      expect(json).to include('id' => campaign.id.to_s, 'name' => 'Shattered Crown', 'pitch' => 'Find the crown',
                              'quests' => [], 'secrets' => [], 'sessions' => [], 'references' => [], 'revelations' => [])
      faction = campaign.factions.sole
      expect(json['factions'].sole).to include('id' => faction.id.to_s, 'name' => 'Iron Hand')
      expect(json['npcs'].sole).to include('name' => 'Vex', 'role' => 'bbeg', 'factionId' => faction.id.to_s)
      expect(campaign.quests).to be_empty
      expect(OpenAIClient).not_to have_received(:for)
    end

    it 'saves nothing when no sections are approved' do
      post apply_path, params: { outline: outline }, as: :json

      expect(response).to have_http_status(:ok)
      expect(json['factions']).to eq([])
      expect(campaign.reload.pitch).to be_nil
    end

    it 'returns 422 and saves nothing when a record cannot be saved' do
      create(:campaign_session, campaign: campaign, number: 1).update_column(:status, 'cancelled')

      post apply_path, params: { outline: outline.merge(sessions: [{ number: 1, title: 'Heist' }]),
                                 sections: %w[factions npcs sessions] }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Status is not included in the list')
      expect(campaign.factions).to be_empty
      expect(campaign.npcs).to be_empty
    end

    it "returns 404 for another user's campaign" do
      post "/v1/campaigns/#{other_campaign.slug}/assistant/apply", params: { outline: outline, sections: %w[factions] },
                                                                   as: :json

      expect(response).to have_http_status(:not_found)
      expect(CampaignFaction.count).to eq(0)
    end
  end

  describe 'rate limiting' do
    let(:memory_cache) { ActiveSupport::Cache::MemoryStore.new }
    let(:limit) { Admin::V1::Campaigns::AssistantController::REQUESTS_PER_HOUR }

    before do
      # The test cache is a NullStore, which never counts
      allow(Rails).to receive(:cache).and_return(memory_cache)
      travel_to Time.zone.local(2026, 10, 15, 10, 5)
    end

    def use_up_the_limit
      limit.times { post outline_path, as: :json }
      expect(response).to have_http_status(:ok)
    end

    it 'allows 30 AI requests an hour, then returns 429' do
      use_up_the_limit

      post outline_path, as: :json

      expect(response).to have_http_status(:too_many_requests)
      expect(json['errors']).to eq(['Too many AI requests this hour. Please try again later.'])
      expect(ai_client).to have_received(:completions).exactly(limit).times
    end

    it 'counts every kind of AI request' do
      10.times { post outline_path, as: :json }
      10.times { post prep_path, params: { step: 'scenes' }, as: :json }
      10.times { post recap_path, as: :json }

      post prep_path, params: { step: 'scenes' }, as: :json
      expect(response).to have_http_status(:too_many_requests)
      post recap_path, as: :json
      expect(response).to have_http_status(:too_many_requests)
    end

    it 'allows requests again the next hour' do
      use_up_the_limit

      travel 1.hour
      post outline_path, as: :json

      expect(response).to have_http_status(:ok)
    end

    it 'limits each user separately' do
      use_up_the_limit

      other_user = create(:dungeon_master_user)
      stub_authentication(other_user)
      post "/v1/campaigns/#{create(:campaign, user: other_user).slug}/assistant/outline", as: :json

      expect(response).to have_http_status(:ok)
    end

    it 'does not limit applying an outline' do
      use_up_the_limit

      post apply_path, params: { outline: { pitch: 'Still works' }, sections: %w[pitch] }, as: :json

      expect(response).to have_http_status(:ok)
      expect(campaign.reload.pitch).to eq('Still works')
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'returns 401' do
      post outline_path, as: :json
      expect(response).to have_http_status(:unauthorized)

      post apply_path, params: { outline: { pitch: 'Sneaky' }, sections: %w[pitch] }, as: :json
      expect(response).to have_http_status(:unauthorized)

      expect(OpenAIClient).not_to have_received(:for)
      expect(campaign.reload.pitch).to be_nil
    end
  end
end
