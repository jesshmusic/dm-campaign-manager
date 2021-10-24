require 'rails_helper'

RSpec.describe 'Conditions', type: :request do
  describe 'GET /index' do
    it 'returns http success' do
      get '/admin/v1/conditions/index'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /show' do
    it 'returns http success' do
      get '/admin/v1/conditions/show'
      expect(response).to have_http_status(:success)
    end
  end

end
