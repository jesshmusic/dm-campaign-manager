# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Feats', type: :request do
  describe 'GET /index' do
    let!(:alert) { create(:feat, :alert, edition: '2024') }
    let!(:grappler) { create(:feat, :grappler, edition: '2024') }
    let!(:homebrew_feat) { create(:feat, :homebrew, edition: '2024') }
    let(:edition_header) { { 'X-DND-Edition' => '2024' } }

    it 'returns http success' do
      get '/v1/feats', headers: { 'Accept' => 'application/json' }.merge(edition_header)
      expect(response).to have_http_status(:success)
    end

    it 'returns srd feats as JSON' do
      get '/v1/feats.json', headers: edition_header
      result = JSON.parse(response.body)

      expect(result).to be_a(Hash)
      expect(result['count']).to eq(2)
      expect(result['results']).to be_an(Array)

      feat_names = result['results'].map { |f| f['name'] }
      expect(feat_names).to include('Alert', 'Grappler')
      expect(feat_names).not_to include(homebrew_feat.name)
    end

    context 'with category parameter' do
      it 'filters feats by category' do
        get '/v1/feats.json', params: { category: 'Origin' }, headers: edition_header
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results'].first['name']).to eq('Alert')
      end
    end

    context 'with search parameter' do
      it 'filters feats by search term' do
        get '/v1/feats.json', params: { search: 'Alert' }, headers: edition_header
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results'].first['name']).to eq('Alert')
      end

      it 'searches by prerequisite' do
        get '/v1/feats.json', params: { search: 'Strength' }, headers: edition_header
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results'].first['name']).to eq('Grappler')
      end
    end

    context 'with edition header' do
      let!(:feat_2014) { create(:feat, name: 'Old Feat', edition: '2014') }

      it 'filters by edition from header' do
        get '/v1/feats.json', headers: { 'X-DND-Edition' => '2014' }
        result = JSON.parse(response.body)

        feat_names = result['results'].map { |f| f['name'] }
        expect(feat_names).to include('Old Feat')
        expect(feat_names).not_to include('Alert')
      end
    end
  end

  describe 'GET /show' do
    let!(:feat) { create(:feat, :alert, edition: '2024') }
    let(:edition_header) { { 'X-DND-Edition' => '2024' } }

    it 'returns http success' do
      get "/v1/feats/#{feat.slug}", headers: { 'Accept' => 'application/json' }.merge(edition_header)
      expect(response).to have_http_status(:success)
    end

    it 'returns the correct feat data as JSON' do
      get "/v1/feats/#{feat.slug}.json", headers: edition_header
      result = JSON.parse(response.body)

      expect(result['name']).to eq('Alert')
      expect(result['slug']).to eq('alert')
      expect(result['category']).to eq('Origin')
      expect(result['description']).to include('Initiative Proficiency')
      expect(result['repeatable']).to be false
    end
  end
end
