require 'rails_helper'

RSpec.describe 'Admin::V1::FoundryMapTagsController', type: :request do
  let(:json) { response.parsed_body }

  context 'when authenticated as an admin' do
    before { stub_admin_auth }

    describe 'GET /v1/map-tags' do
      it 'returns tags with map counts' do
        tag = create(:foundry_map_tag)

        get '/v1/map-tags'

        expect(response).to have_http_status(:success)
        expect(json.first).to include('id' => tag.id.to_s, 'name' => tag.name, 'mapCount' => 0)
      end
    end

    describe 'POST /v1/map-tags' do
      it 'creates a tag' do
        expect do
          post '/v1/map-tags', params: { foundry_map_tag: { name: 'Swamp' } }
        end.to change(FoundryMapTag, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json['name']).to eq('Swamp')
      end
    end

    describe 'PATCH /v1/map-tags/:id' do
      it 'renames a tag' do
        tag = create(:foundry_map_tag)

        patch "/v1/map-tags/#{tag.id}", params: { foundry_map_tag: { name: 'Marsh' } }

        expect(response).to have_http_status(:success)
        expect(tag.reload.name).to eq('Marsh')
      end
    end

    describe 'DELETE /v1/map-tags/:id' do
      it 'deletes a tag' do
        tag = create(:foundry_map_tag)

        expect do
          delete "/v1/map-tags/#{tag.id}"
        end.to change(FoundryMapTag, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'rejects requests with 401' do
      tag = create(:foundry_map_tag)

      get '/v1/map-tags'
      expect(response).to have_http_status(:unauthorized)

      post '/v1/map-tags', params: { foundry_map_tag: { name: 'Swamp' } }
      expect(response).to have_http_status(:unauthorized)

      delete "/v1/map-tags/#{tag.id}"
      expect(response).to have_http_status(:unauthorized)
      expect(FoundryMapTag.count).to eq(1)
    end
  end

  context 'when authenticated as a non-admin' do
    before { stub_dungeon_master_auth }

    it 'rejects requests with 403' do
      tag = create(:foundry_map_tag)

      post '/v1/map-tags', params: { foundry_map_tag: { name: 'Swamp' } }
      expect(response).to have_http_status(:forbidden)

      patch "/v1/map-tags/#{tag.id}", params: { foundry_map_tag: { name: 'Marsh' } }
      expect(response).to have_http_status(:forbidden)
      expect(tag.reload.name).not_to eq('Marsh')
    end
  end
end
