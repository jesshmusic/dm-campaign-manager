require 'rails_helper'

RSpec.describe "Skills", type: :request do
  describe "GET /index" do
    let!(:skill1) { create(:skill, name: 'Perception', desc: 'Your ability to notice things') }
    let!(:skill2) { create(:skill, name: 'Stealth', desc: 'Your ability to hide') }
    let!(:skill3) { create(:skill, name: 'Investigation', desc: 'Your ability to deduce clues') }

    it 'returns http success' do
      get '/v1/skills', headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end

    it 'returns all skills as JSON' do
      get '/v1/skills.json'
      result = JSON.parse(response.body)

      expect(result).to be_a(Hash)
      expect(result['count']).to be >= 3
      expect(result['results']).to be_an(Array)

      skill_names = result['results'].map { |s| s['name'] }
      expect(skill_names).to include('Perception', 'Stealth', 'Investigation')
    end

    context 'with search parameter' do
      it 'filters skills by search term' do
        get '/v1/skills.json', params: { search: 'Perception' }
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results']).to be_an(Array)
        expect(result['results'].first['name']).to eq('Perception')
      end

      it 'searches by description' do
        get '/v1/skills.json', params: { search: 'hide' }
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results']).to be_an(Array)
        expect(result['results'].first['name']).to eq('Stealth')
      end

      it 'supports prefix search' do
        get '/v1/skills.json', params: { search: 'Inv' }
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1)
        expect(result['results']).to be_an(Array)
        expect(result['results'].first['name']).to eq('Investigation')
      end

      it 'returns empty array when no skills match' do
        get '/v1/skills.json', params: { search: 'nonexistent' }
        result = JSON.parse(response.body)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(0)
        expect(result['results']).to be_an(Array)
        expect(result['results'].length).to eq(0)
      end
    end
  end

  describe "GET /show" do
    let!(:skill) { create(:skill, name: 'Acrobatics', ability_score: 'Dexterity', desc: 'Your ability to perform acrobatic stunts') }

    it 'returns http success' do
      get "/v1/skills/#{skill.slug}", headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end

    it 'returns the correct skill data as JSON' do
      get "/v1/skills/#{skill.slug}.json"
      result = JSON.parse(response.body)

      expect(result['name']).to eq('Acrobatics')
      expect(result['slug']).to eq(skill.slug)
      expect(result['abilityScore']).to eq('Dexterity')
      expect(result['desc']).to eq('Your ability to perform acrobatic stunts')
    end

    it 'finds skill by slug' do
      get "/v1/skills/#{skill.slug}.json"
      result = JSON.parse(response.body)

      expect(result['slug']).to eq('acrobatics')
    end
  end
end
