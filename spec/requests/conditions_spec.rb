require 'rails_helper'

RSpec.describe 'Conditions', type: :request do
  describe 'GET /index' do
    it 'returns http success' do
      get '/v1/conditions', headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /show' do
    it 'returns http success' do
      condition = Condition.create!(name: 'Test Condition', slug: 'test-condition')
      get "/v1/conditions/#{condition.id}", headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end
  end

end
