require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::ReferencesController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }

  it_behaves_like 'a campaign child resource', path: 'references', root: :reference, factory: :campaign_reference do
    let(:valid_attributes) do
      { name: 'Cult Fanatic', book: 'mm', category: 'monster', page: 92, challenge_rating: '2', notes: 'Use for zealots' }
    end
    let(:created_json) do
      { 'name' => 'Cult Fanatic', 'book' => 'mm', 'category' => 'monster', 'page' => 92, 'challengeRating' => '2',
        'notes' => 'Use for zealots', 'citation' => 'Monster Manual p. 92', 'foundryUuid' => nil }
    end
    let(:invalid_attributes) { { book: 'xgte' } }
    let(:invalid_message) { 'Book is not included in the list' }
    let(:update_attributes) { { foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.abc123' } }
    let(:updated_json) { { 'foundryUuid' => 'Compendium.dnd-monster-manual.actors.Actor.abc123' } }
  end

  describe 'GET /v1/campaigns/:campaign_id' do
    before { stub_authentication(user) }

    it 'includes book references in the full campaign' do
      create(:campaign_reference, campaign: campaign, name: 'Bag of Holding', book: 'dmg', category: 'magic_item', page: 224)

      get "/v1/campaigns/#{campaign.slug}"

      expect(json['references']).to contain_exactly(include('name' => 'Bag of Holding', 'citation' => "Dungeon Master's Guide p. 224"))
    end
  end
end
