require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::LocationsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:locations_path) { "/v1/campaigns/#{campaign.slug}/locations" }

  it_behaves_like 'a campaign child resource', path: 'locations', root: :location, factory: :campaign_location do
    let(:valid_attributes) { { name: 'Phandalin', description: 'A frontier town', features: ['Stonehill Inn', 'Shrine of Luck'] } }
    let(:created_json) do
      { 'name' => 'Phandalin', 'description' => 'A frontier town', 'features' => ['Stonehill Inn', 'Shrine of Luck'],
        'parentId' => nil, 'foundryMapId' => nil }
    end
    let(:invalid_attributes) { { name: '' } }
    let(:invalid_message) { "Name can't be blank" }
    let(:update_attributes) { { features: ['Tresendar Manor'] } }
    let(:updated_json) { { 'features' => ['Tresendar Manor'] } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    let(:city) { create(:campaign_location, campaign: campaign, name: 'Waterdeep') }

    it 'orders locations by name' do
      create(:campaign_location, campaign: campaign, name: 'Neverwinter')
      create(:campaign_location, campaign: campaign, name: 'Baldurs Gate')

      get locations_path

      expect(json.pluck('name')).to eq(['Baldurs Gate', 'Neverwinter'])
    end

    it 'nests a location under a parent and links a map' do
      map = create(:foundry_map)

      post locations_path, params: { location: { name: 'Dock Ward', parent_id: city.id, foundry_map_id: map.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json).to include('parentId' => city.id.to_s, 'foundryMapId' => map.id.to_s)
    end

    it 'rejects a parent from another campaign' do
      foreign = create(:campaign_location, campaign: create(:campaign, user: user))

      post locations_path, params: { location: { name: 'Dock Ward', parent_id: foreign.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Parent must belong to the same campaign')
    end

    it 'rejects a parent that does not exist' do
      post locations_path, params: { location: { name: 'Dock Ward', parent_id: 0 } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Parent must exist')
    end

    it 'rejects a map that does not exist' do
      post locations_path, params: { location: { name: 'Dock Ward', foundry_map_id: 0 } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Foundry map must exist')
    end

    it 'rejects moving a location inside itself' do
      ward = create(:campaign_location, campaign: campaign, parent: city)

      patch "#{locations_path}/#{city.id}", params: { location: { parent_id: ward.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include("Parent can't be this location or one inside it")
      expect(city.reload.parent_id).to be_nil
    end

    it 'rejects too many features' do
      post locations_path, params: { location: { name: 'Market', features: Array.new(21) { |i| "Stall #{i}" } } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Features must be a list of up to 20 entries')
    end
  end
end
