require 'rails_helper'

RSpec.describe 'Admin::V1::FoundryMapsController', type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /v1/maps/tags' do
    let!(:tags) { create_list(:foundry_map_tag, 3) }

    it 'returns all tags ordered' do
      get '/v1/maps/tags'

      expect(response).to have_http_status(:success)
      expect(json.length).to eq(3)
      expect(json.first).to include('value', 'label', 'count')
    end

    it 'returns tags in alphabetical order' do
      create(:foundry_map_tag, name: 'Zebra')
      create(:foundry_map_tag, name: 'Apple')

      get '/v1/maps/tags'

      names = json.map { |tag| tag['label'] }
      expect(names).to eq(names.sort)
    end
  end

  describe 'GET /v1/maps/list' do
    let!(:published_maps) { create_list(:foundry_map, 3, published: true) }
    let!(:unpublished_map) { create(:foundry_map, :unpublished) }

    it 'returns only published maps' do
      get '/v1/maps/list'

      expect(response).to have_http_status(:success)
      expect(json.length).to eq(3)
    end

    it 'returns maps in recent order' do
      get '/v1/maps/list'

      ids = json.map { |m| m['id'] }
      expect(ids).to eq(published_maps.reverse.map { |m| m.id.to_s })
    end

    it 'includes tag information' do
      map_with_tags = create(:foundry_map, :with_tags, published: true)

      get '/v1/maps/list'

      map_json = json.find { |m| m['id'] == map_with_tags.id.to_s }
      expect(map_json['tags']).to be_an(Array)
      expect(map_json['tags'].length).to eq(3)
    end
  end

  describe 'GET /v1/maps/files/:id' do
    let(:map) { create(:foundry_map, :with_files) }

    context 'for free maps' do
      let(:free_map) { create(:foundry_map, :with_files, access_level: 'free') }

      it 'returns files without authentication' do
        get "/v1/maps/files/#{free_map.id}"

        expect(response).to have_http_status(:success)
        expect(json['mapId']).to eq(free_map.id.to_s)
        expect(json['files']).to be_an(Array)
        expect(json['files'].length).to eq(3)
      end

      it 'includes total size' do
        get "/v1/maps/files/#{free_map.id}"

        expect(json['totalSize']).to be_a(Integer)
        expect(json['totalSize']).to be > 0
      end
    end

    context 'for premium maps' do
      let(:premium_map) { create(:foundry_map, :premium, :with_files) }
      let(:premium_user) { create(:patreon_user, :wizard) }

      it 'requires authentication' do
        get "/v1/maps/files/#{premium_map.id}"

        expect(response).to have_http_status(:unauthorized)
        expect(json['error']).to eq('Authentication required for Premium maps')
      end

      it 'requires premium access' do
        free_user = create(:patreon_user, :free)
        get "/v1/maps/files/#{premium_map.id}", headers: { 'Authorization' => free_user.user_id }

        expect(response).to have_http_status(:forbidden)
        expect(json['error']).to eq('Premium access required')
      end

      it 'allows access with premium authentication' do
        get "/v1/maps/files/#{premium_map.id}", headers: { 'Authorization' => premium_user.user_id }

        expect(response).to have_http_status(:success)
        expect(json['files']).to be_an(Array)
      end

      it 'denies access with expired premium user' do
        expired_user = create(:patreon_user, :wizard, :expired)
        get "/v1/maps/files/#{premium_map.id}", headers: { 'Authorization' => expired_user.user_id }

        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'POST /v1/maps/file/:id' do
    let(:map) { create(:foundry_map, :with_files) }
    let(:file) { map.foundry_map_files.first }

    context 'for free maps' do
      let(:free_map) { create(:foundry_map, :with_files, access_level: 'free') }
      let(:free_file) { free_map.foundry_map_files.first }

      it 'returns signed URL without authentication' do
        allow_any_instance_of(FoundryMapFile).to receive(:generate_signed_url).and_return('https://example.com/signed-url')

        post "/v1/maps/file/#{free_map.id}", params: { path: free_file.file_path }

        expect(response).to have_http_status(:success)
        expect(json['url']).to eq('https://example.com/signed-url')
      end

      it 'returns 404 for non-existent file' do
        post "/v1/maps/file/#{free_map.id}", params: { path: 'non/existent/file.json' }

        expect(response).to have_http_status(:not_found)
        expect(json['error']).to eq('File not found')
      end
    end

    context 'for premium maps' do
      let(:premium_map) { create(:foundry_map, :premium, :with_files) }
      let(:premium_file) { premium_map.foundry_map_files.first }
      let(:premium_user) { create(:patreon_user, :wizard) }

      it 'requires authentication' do
        post "/v1/maps/file/#{premium_map.id}", params: { path: premium_file.file_path }

        expect(response).to have_http_status(:unauthorized)
      end

      it 'allows access with premium authentication' do
        allow_any_instance_of(FoundryMapFile).to receive(:generate_signed_url).and_return('https://example.com/signed-url')

        post "/v1/maps/file/#{premium_map.id}",
             params: { path: premium_file.file_path },
             headers: { 'Authorization' => premium_user.user_id }

        expect(response).to have_http_status(:success)
        expect(json['url']).to be_present
      end
    end
  end

  describe 'GET /v1/maps' do
    let!(:maps) { create_list(:foundry_map, 3) }

    it 'returns all maps' do
      get '/v1/maps'

      expect(response).to have_http_status(:success)
      expect(json.length).to eq(3)
    end

    it 'includes tag information' do
      map_with_tags = create(:foundry_map, :with_tags)

      get '/v1/maps'

      map_json = json.find { |m| m['id'] == map_with_tags.id.to_s }
      expect(map_json['tags']).to be_an(Array)
    end

    it 'orders maps by created_at descending' do
      get '/v1/maps'

      ids = json.map { |m| m['id'] }
      expect(ids.first).to eq(maps.last.id.to_s)
    end
  end

  describe 'GET /v1/maps/:id' do
    let(:map) { create(:foundry_map, :with_files) }

    it 'returns map details with files' do
      get "/v1/maps/#{map.id}"

      expect(response).to have_http_status(:success)
      expect(json['id']).to eq(map.id.to_s)
      expect(json['files']).to be_an(Array)
      expect(json['files'].length).to eq(3)
    end

    it 'returns 404 for non-existent map' do
      expect {
        get '/v1/maps/999999'
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe 'POST /v1/maps' do
    let(:valid_params) do
      {
        foundry_map: {
          name: 'New Map',
          description: 'A test map',
          access_level: 'free',
          published: true,
          grid_size: 100,
          width: 4000,
          height: 3000
        }
      }
    end

    it 'creates a new map' do
      expect {
        post '/v1/maps', params: valid_params
      }.to change(FoundryMap, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json['name']).to eq('New Map')
    end

    it 'creates tags when provided' do
      post '/v1/maps', params: valid_params.merge(tags: ['Dungeon', 'Cave'])

      map = FoundryMap.last
      expect(map.foundry_map_tags.pluck(:name)).to contain_exactly('Dungeon', 'Cave')
    end

    it 'returns errors for invalid params' do
      post '/v1/maps', params: { foundry_map: { description: 'Missing name' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to be_an(Array)
    end

    it 'accepts keywords array' do
      params = valid_params.deep_merge(foundry_map: { keywords: ['dungeon', 'underground'] })
      post '/v1/maps', params: params

      expect(response).to have_http_status(:created)
      expect(json['keywords']).to eq(['dungeon', 'underground'])
    end
  end

  describe 'PATCH /v1/maps/:id' do
    let(:map) { create(:foundry_map) }

    it 'updates the map' do
      patch "/v1/maps/#{map.id}", params: { foundry_map: { name: 'Updated Name' } }

      expect(response).to have_http_status(:success)
      expect(json['name']).to eq('Updated Name')
      expect(map.reload.name).to eq('Updated Name')
    end

    it 'updates tags' do
      patch "/v1/maps/#{map.id}", params: { foundry_map: { name: map.name }, tags: ['Forest', 'River'] }

      expect(response).to have_http_status(:success)
      expect(map.reload.foundry_map_tags.pluck(:name)).to contain_exactly('Forest', 'River')
    end

    it 'returns errors for invalid params' do
      patch "/v1/maps/#{map.id}", params: { foundry_map: { access_level: 'invalid' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to be_an(Array)
    end
  end

  describe 'DELETE /v1/maps/:id' do
    let!(:map) { create(:foundry_map) }

    it 'deletes the map' do
      expect {
        delete "/v1/maps/#{map.id}"
      }.to change(FoundryMap, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it 'cascades delete to associated records' do
      map_with_files = create(:foundry_map, :with_files, :with_tags)

      expect {
        delete "/v1/maps/#{map_with_files.id}"
      }.to change(FoundryMapFile, :count).by(-3)
    end
  end

  describe 'POST /v1/maps/:id/upload_thumbnail' do
    let(:map) { create(:foundry_map) }
    let(:thumbnail_file) { fixture_file_upload(Rails.root.join('spec/fixtures/test_image.jpg'), 'image/jpeg') }

    before do
      # Mock S3 client
      allow_any_instance_of(Aws::S3::Client).to receive(:put_object).and_return(true)
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('AWS_REGION').and_return('us-east-1')
      allow(ENV).to receive(:[]).with('AWS_S3_BUCKET').and_return('test-bucket')
    end

    it 'uploads thumbnail and updates map' do
      post "/v1/maps/#{map.id}/upload_thumbnail", params: { thumbnail: thumbnail_file }

      expect(response).to have_http_status(:success)
      expect(map.reload.thumbnail_s3_key).to be_present
      expect(map.thumbnail_url).to be_present
    end

    it 'returns error when no file provided' do
      post "/v1/maps/#{map.id}/upload_thumbnail"

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['error']).to eq('No thumbnail file provided')
    end
  end

  describe 'DELETE /v1/maps/:id/files/:file_id' do
    let!(:map) { create(:foundry_map, :with_files) }
    let(:file) { map.foundry_map_files.first }

    it 'deletes the file' do
      expect {
        delete "/v1/maps/#{map.id}/files/#{file.id}"
      }.to change(FoundryMapFile, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
