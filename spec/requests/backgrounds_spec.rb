# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Backgrounds', type: :request do
  describe 'GET /index' do
    let!(:acolyte) { create(:background, :acolyte, edition: '2024') }
    let!(:criminal) { create(:background, :criminal, edition: '2024') }
    let!(:homebrew_bg) { create(:background, :homebrew, edition: '2024') }
    let(:edition_header) { { 'X-DND-Edition' => '2024' } }

    it 'returns http success' do
      get '/v1/backgrounds', headers: { 'Accept' => 'application/json' }.merge(edition_header)
      expect(response).to have_http_status(:success)
    end

    it 'returns srd backgrounds as JSON' do
      get '/v1/backgrounds.json', headers: edition_header
      result = JSON.parse(response.body)

      expect(result).to be_a(Hash)
      expect(result['count']).to eq(2)
      expect(result['results']).to be_an(Array)

      background_names = result['results'].map { |b| b['name'] }
      expect(background_names).to include('Acolyte', 'Criminal')
      expect(background_names).not_to include(homebrew_bg.name)
    end

    context 'with search parameter' do
      it 'filters backgrounds by search term' do
        get '/v1/backgrounds.json', params: { search: 'Acolyte' }, headers: edition_header
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results'].first['name']).to eq('Acolyte')
      end

      it 'searches by feat name' do
        get '/v1/backgrounds.json', params: { search: 'Alert' }, headers: edition_header
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results'].first['name']).to eq('Criminal')
      end
    end

    context 'with edition header' do
      let!(:bg_2014) { create(:background, name: 'Old Background', edition: '2014') }

      it 'filters by edition from header' do
        get '/v1/backgrounds.json', headers: { 'X-DND-Edition' => '2014' }
        result = JSON.parse(response.body)

        background_names = result['results'].map { |b| b['name'] }
        expect(background_names).to include('Old Background')
        expect(background_names).not_to include('Acolyte')
      end
    end
  end

  describe 'GET /show' do
    let!(:background) { create(:background, :acolyte, edition: '2024') }
    let(:edition_header) { { 'X-DND-Edition' => '2024' } }

    it 'returns http success' do
      get "/v1/backgrounds/#{background.slug}", headers: { 'Accept' => 'application/json' }.merge(edition_header)
      expect(response).to have_http_status(:success)
    end

    it 'returns the correct background data as JSON' do
      get "/v1/backgrounds/#{background.slug}.json", headers: edition_header
      result = JSON.parse(response.body)

      expect(result['name']).to eq('Acolyte')
      expect(result['slug']).to eq('acolyte')
      expect(result['abilityScores']).to eq(%w[Intelligence Wisdom Charisma])
      expect(result['skillProficiencies']).to eq(%w[Insight Religion])
      expect(result['feat_name']).to eq('Magic Initiate (Cleric)')
      expect(result['tool_proficiency']).to eq("Calligrapher's Supplies")
    end
  end
end
