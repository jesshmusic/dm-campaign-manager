require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::SessionsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:sessions_path) { "/v1/campaigns/#{campaign.slug}/sessions" }

  it_behaves_like 'a campaign child resource', path: 'sessions', root: :session, factory: :campaign_session do
    let(:valid_attributes) do
      { title: 'Goblin Arrows', scheduled_on: '2026-10-20', level: 1, character_notes: 'Rogue owes money',
        strong_start: 'Ambush on the road', scenes: ['Ambush', 'Goblin trail'], treasure: '10 gp' }
    end
    let(:created_json) do
      { 'number' => 1, 'title' => 'Goblin Arrows', 'displayTitle' => 'Goblin Arrows', 'scheduledOn' => '2026-10-20',
        'status' => 'planned', 'level' => 1, 'characterNotes' => 'Rogue owes money',
        'strongStart' => 'Ambush on the road', 'scenes' => ['Ambush', 'Goblin trail'], 'treasure' => '10 gp',
        'treasureCurrency' => {}, 'foundryScenes' => [], 'links' => [] }
    end
    let(:invalid_attributes) { { status: 'cancelled' } }
    let(:invalid_message) { 'Status is not included in the list' }
    let(:update_attributes) { { status: 'played', log: 'The party fled', recap: 'They fled' } }
    let(:updated_json) { { 'status' => 'played', 'log' => 'The party fled', 'recap' => 'They fled' } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    it 'numbers new sessions after the last one' do
      create(:campaign_session, campaign: campaign, number: 3)

      post sessions_path, params: { session: { title: 'Next' } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json['number']).to eq(4)
    end

    it 'rejects a number already used in the campaign' do
      create(:campaign_session, campaign: campaign, number: 1)

      post sessions_path, params: { session: { number: 1 } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Number has already been taken')
    end

    it 'orders sessions by number' do
      create(:campaign_session, campaign: campaign, number: 2)
      create(:campaign_session, campaign: campaign, number: 1)

      get sessions_path

      expect(json.pluck('number')).to eq([1, 2])
    end

    it 'shows the prepped links' do
      session = create(:campaign_session, campaign: campaign)
      create(:campaign_session_link, session: session, linkable: create(:campaign_npc, campaign: campaign, name: 'Sildar'))

      get "#{sessions_path}/#{session.id}"

      expect(json['links'].sole).to include('linkableType' => 'CampaignNpc', 'name' => 'Sildar', 'position' => 0)
    end

    describe 'treasure coins' do
      let(:session) { create(:campaign_session, campaign: campaign, treasure_currency: { gp: 10 }) }
      let(:session_path) { "#{sessions_path}/#{session.id}" }

      it 'saves the coins' do
        patch session_path, params: { session: { treasure_currency: { pp: 1, gp: 50, sp: 12 } } }, as: :json

        expect(response).to have_http_status(:success)
        expect(json['treasureCurrency']).to eq('pp' => 1, 'gp' => 50, 'sp' => 12)
        expect(session.reload.treasure_currency).to eq('pp' => 1, 'gp' => 50, 'sp' => 12)
      end

      it 'creates a session with coins' do
        post sessions_path, params: { session: { title: 'Hoard', treasure_currency: { gp: 100 } } }, as: :json

        expect(response).to have_http_status(:created)
        expect(json['treasureCurrency']).to eq('gp' => 100)
      end

      it 'clears the coins' do
        patch session_path, params: { session: { treasure_currency: {} } }, as: :json

        expect(response).to have_http_status(:success)
        expect(session.reload.treasure_currency).to eq({})
      end

      it 'leaves out coins that are not pp, gp, ep, sp or cp' do
        patch session_path, params: { session: { treasure_currency: { gp: 5, zz: 99 } } }, as: :json

        expect(response).to have_http_status(:success)
        expect(session.reload.treasure_currency).to eq('gp' => 5)
      end

      it 'rejects counts that are not whole numbers in range' do
        patch session_path, params: { session: { treasure_currency: { gp: -5 } } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Treasure currency must be whole numbers of pp, gp, ep, sp and cp, up to 1,000,000 each')
        expect(session.reload.treasure_currency).to eq('gp' => 10)
      end

      it 'keeps the coins when other fields change' do
        patch session_path, params: { session: { treasure: 'A silver chalice' } }, as: :json

        expect(session.reload).to have_attributes(treasure: 'A silver chalice', treasure_currency: { 'gp' => 10 })
      end
    end

    it "can't change the session's Foundry scenes, which are picked in Foundry" do
      session = create(:campaign_session, campaign: campaign)

      patch "#{sessions_path}/#{session.id}",
            params: { session: { title: 'Pass', foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }] } },
            as: :json

      expect(response).to have_http_status(:success)
      expect(session.reload).to have_attributes(title: 'Pass', foundry_scenes: [])
    end

    it 'shows the Foundry scenes picked in Foundry' do
      session = create(:campaign_session, campaign: campaign,
                                          foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])

      get "#{sessions_path}/#{session.id}"

      expect(json['foundryScenes']).to eq([{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }])
    end

    it 'deletes its links with it' do
      session = create(:campaign_session, campaign: campaign)
      create(:campaign_session_link, session: session)

      expect { delete "#{sessions_path}/#{session.id}" }.to change(CampaignSessionLink, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
