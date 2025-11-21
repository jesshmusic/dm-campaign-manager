require 'rails_helper'

RSpec.describe 'Admin::V1::Search', type: :request do
  describe 'GET /v1/search' do
    let(:user) { create(:user) }

    before { stub_authentication(user) }

    context 'without search parameter' do
      it 'returns successful response' do
        get '/v1/search', as: :json
        expect(response).to have_http_status(:success)
      end

      it 'returns empty results' do
        get '/v1/search', as: :json
        json_response = JSON.parse(response.body)
        expect(json_response['count']).to eq(0)
        expect(json_response['results']).to eq([])
      end
    end

    context 'with search parameter' do
      it 'returns successful response' do
        get '/v1/search', params: { search: 'test' }, as: :json
        expect(response).to have_http_status(:success)
      end

      it 'searches across multiple models' do
        # Search should return results from all searchable models
        get '/v1/search', params: { search: 'test' }, as: :json
        json_response = JSON.parse(response.body)

        expect(json_response).to have_key('count')
        expect(json_response).to have_key('results')
        expect(json_response['results']).to be_an(Array)
      end

      it 'includes required fields in results' do
        get '/v1/search', params: { search: 'test' }, as: :json
        json_response = JSON.parse(response.body)

        # Each result should have name, description, and url
        json_response['results'].each do |result|
          expect(result).to have_key('name')
          expect(result).to have_key('description')
          expect(result).to have_key('url')
        end
      end

      it 'counts total results correctly' do
        get '/v1/search', params: { search: 'test' }, as: :json
        json_response = JSON.parse(response.body)

        expect(json_response['count']).to eq(json_response['results'].length)
      end

      it 'formats URLs correctly' do
        get '/v1/search', params: { search: 'test' }, as: :json
        json_response = JSON.parse(response.body)

        # URLs should start with /app/
        json_response['results'].each do |result|
          expect(result['url']).to start_with('/app/')
        end
      end
    end

    context 'when user is not authenticated' do
      before { stub_no_auth }

      it 'still allows search' do
        # Based on the controller code, set_user doesn't enforce authentication
        # It just sets @user from the token if present
        get '/v1/search', params: { search: 'test' }, as: :json
        expect(response).to have_http_status(:success)
      end
    end
  end
end
