require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::SecretsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:secrets_path) { "/v1/campaigns/#{campaign.slug}/secrets" }

  it_behaves_like 'a campaign child resource', path: 'secrets', root: :secret, factory: :campaign_secret do
    let(:valid_attributes) { { text: 'The mayor is a doppelganger', revelation: 'Mayor', position: 1 } }
    let(:created_json) do
      { 'text' => 'The mayor is a doppelganger', 'revelation' => 'Mayor', 'position' => 1, 'revealed' => false,
        'revealedAt' => nil, 'revealedSessionId' => nil }
    end
    let(:invalid_attributes) { { text: '' } }
    let(:invalid_message) { "Text can't be blank" }
    let(:update_attributes) { { revelation: 'Mayor is a fake' } }
    let(:updated_json) { { 'revelation' => 'Mayor is a fake' } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    let(:secret) { create(:campaign_secret, campaign: campaign) }
    let(:session) { create(:campaign_session, campaign: campaign) }

    it 'orders secrets by position' do
      second = create(:campaign_secret, campaign: campaign, position: 2)
      first = create(:campaign_secret, campaign: campaign, position: 1)

      get secrets_path

      expect(json.pluck('id')).to eq([first.id.to_s, second.id.to_s])
    end

    it 'reveals a secret in a session' do
      freeze_time do
        patch "#{secrets_path}/#{secret.id}", params: { secret: { revealed: true, revealed_session_id: session.id } }, as: :json

        expect(response).to have_http_status(:success)
        expect(json).to include('revealed' => true, 'revealedAt' => Time.current.iso8601,
                                'revealedSessionId' => session.id.to_s)
      end
    end

    it 'hides a revealed secret again' do
      secret.update!(revealed: true, revealed_session: session)

      patch "#{secrets_path}/#{secret.id}", params: { secret: { revealed: false } }, as: :json

      expect(json).to include('revealed' => false, 'revealedAt' => nil, 'revealedSessionId' => nil)
    end

    it 'rejects a session from another campaign' do
      foreign = create(:campaign_session, campaign: create(:campaign, user: user))

      patch "#{secrets_path}/#{secret.id}", params: { secret: { revealed: true, revealed_session_id: foreign.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Revealed session must belong to the same campaign')
      expect(secret.reload).not_to be_revealed
    end

    it 'updates the Three Clue Rule summary on the campaign' do
      post secrets_path, params: { secret: { text: 'Clue 1', revelation: 'Who is the spider?' } }, as: :json
      post secrets_path, params: { secret: { text: 'Clue 2', revelation: 'Who is the spider?', revealed: true } }, as: :json

      get "/v1/campaigns/#{campaign.slug}"

      expect(json['revelations']).to eq([{ 'name' => 'Who is the spider?', 'clueCount' => 2, 'revealedCount' => 1 }])
    end
  end
end
