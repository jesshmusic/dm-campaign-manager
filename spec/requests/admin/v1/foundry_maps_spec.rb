require 'rails_helper'

RSpec.describe 'Admin::V1::FoundryMapsController', type: :request do
  let(:json) { response.parsed_body }

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

      names = json.pluck('label')
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

      ids = json.pluck('id')
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

      it 'increments download count once per manifest request' do
        expect do
          get "/v1/maps/files/#{free_map.id}"
        end.to change { free_map.reload.download_count }.by(1)
      end
    end

    context 'for unpublished maps' do
      let(:unpublished_map) { create(:foundry_map, :with_files, :unpublished) }

      it 'does not serve them' do
        expect do
          get "/v1/maps/files/#{unpublished_map.id}"
        end.to raise_error(ActiveRecord::RecordNotFound)
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
    before { stub_admin_auth }

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

    it 'includes download count' do
      map_with_downloads = create(:foundry_map, download_count: 42)

      get '/v1/maps'

      map_json = json.find { |m| m['id'] == map_with_downloads.id.to_s }
      expect(map_json['downloadCount']).to eq(42)
    end

    it 'orders maps by created_at descending' do
      get '/v1/maps'

      ids = json.pluck('id')
      expect(ids.first).to eq(maps.last.id.to_s)
    end
  end

  describe 'GET /v1/maps/:id' do
    before { stub_admin_auth }

    let(:map) { create(:foundry_map, :with_files) }

    it 'returns map details with files' do
      get "/v1/maps/#{map.id}"

      expect(response).to have_http_status(:success)
      expect(json['id']).to eq(map.id.to_s)
      expect(json['files']).to be_an(Array)
      expect(json['files'].length).to eq(3)
    end

    it 'returns 404 for non-existent map' do
      expect do
        get '/v1/maps/999999'
      end.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe 'POST /v1/maps' do
    before { stub_admin_auth }

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
      expect do
        post '/v1/maps', params: valid_params
      end.to change(FoundryMap, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json['name']).to eq('New Map')
    end

    it 'creates tags when provided' do
      post '/v1/maps', params: valid_params.merge(tags: %w[Dungeon Cave])

      map = FoundryMap.last
      expect(map.foundry_map_tags.pluck(:name)).to contain_exactly('Dungeon', 'Cave')
    end

    it 'returns errors for invalid params' do
      post '/v1/maps', params: { foundry_map: { description: 'Missing name' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to be_an(Array)
    end

    it 'accepts keywords array' do
      params = valid_params.deep_merge(foundry_map: { keywords: %w[dungeon underground] })
      post '/v1/maps', params: params

      expect(response).to have_http_status(:created)
      expect(json['keywords']).to eq(%w[dungeon underground])
    end
  end

  describe 'PATCH /v1/maps/:id' do
    before { stub_admin_auth }

    let(:map) { create(:foundry_map) }

    it 'updates the map' do
      patch "/v1/maps/#{map.id}", params: { foundry_map: { name: 'Updated Name' } }

      expect(response).to have_http_status(:success)
      expect(json['name']).to eq('Updated Name')
      expect(map.reload.name).to eq('Updated Name')
    end

    it 'updates tags' do
      patch "/v1/maps/#{map.id}", params: { foundry_map: { name: map.name }, tags: %w[Forest River] }

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
    before { stub_admin_auth }

    let!(:map) { create(:foundry_map) }

    it 'deletes the map' do
      expect do
        delete "/v1/maps/#{map.id}"
      end.to change(FoundryMap, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it 'cascades delete to associated records' do
      map_with_files = create(:foundry_map, :with_files, :with_tags)

      expect do
        delete "/v1/maps/#{map_with_files.id}"
      end.to change(FoundryMapFile, :count).by(-3)
    end
  end

  describe 'POST /v1/maps/:id/upload_thumbnail' do
    before { stub_admin_auth }

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
    before { stub_admin_auth }

    let!(:map) { create(:foundry_map, :with_files) }
    let(:file) { map.foundry_map_files.first }

    it 'deletes the file' do
      expect do
        delete "/v1/maps/#{map.id}/files/#{file.id}"
      end.to change(FoundryMapFile, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it 'deletes the S3 object' do
      s3_client = instance_double(Aws::S3::Client, delete_object: true)
      allow(Aws::S3::Client).to receive(:new).and_return(s3_client)

      delete "/v1/maps/#{map.id}/files/#{file.id}"

      expect(s3_client).to have_received(:delete_object).with(hash_including(key: file.s3_key))
    end
  end

  describe 'admin authorization' do
    let(:map) { create(:foundry_map, :with_files) }
    let(:tag) { create(:foundry_map_tag) }
    let(:admin_requests) do
      {
        'GET /v1/maps' => -> { get '/v1/maps' },
        'GET /v1/maps/:id' => -> { get "/v1/maps/#{map.id}" },
        'POST /v1/maps' => -> { post '/v1/maps', params: { foundry_map: { name: 'Sneaky Map' } } },
        'PATCH /v1/maps/:id' => -> { patch "/v1/maps/#{map.id}", params: { foundry_map: { name: 'Renamed' } } },
        'DELETE /v1/maps/:id' => -> { delete "/v1/maps/#{map.id}" },
        'GET /v1/maps/:id/presign_upload' => -> { get "/v1/maps/#{map.id}/presign_upload", params: { filename: 'map.zip' } },
        'POST /v1/maps/:id/process_s3_upload' => -> { post "/v1/maps/#{map.id}/process_s3_upload", params: { s3_key: 'x' } },
        'POST /v1/maps/:id/upload_thumbnail' => -> { post "/v1/maps/#{map.id}/upload_thumbnail" },
        'POST /v1/maps/upload_image' => -> { post '/v1/maps/upload_image' },
        'DELETE /v1/maps/:id/files/:file_id' => -> { delete "/v1/maps/#{map.id}/files/#{map.foundry_map_files.first.id}" }
      }
    end

    context 'when not authenticated' do
      before { stub_no_auth }

      it 'rejects every admin endpoint with 401' do
        admin_requests.each do |name, make_request|
          instance_exec(&make_request)
          expect(response).to have_http_status(:unauthorized), "expected 401 for #{name}, got #{response.status}"
        end
      end

      it 'does not create, change, or delete maps' do
        map
        admin_requests.each_value { |make_request| instance_exec(&make_request) }

        expect(FoundryMap.count).to eq(1)
        expect(map.reload.name).not_to eq('Renamed')
        expect(map.foundry_map_files.count).to eq(3)
      end
    end

    context 'when authenticated as a non-admin' do
      before { stub_dungeon_master_auth }

      it 'rejects every admin endpoint with 403' do
        admin_requests.each do |name, make_request|
          instance_exec(&make_request)
          expect(response).to have_http_status(:forbidden), "expected 403 for #{name}, got #{response.status}"
        end
      end
    end

    context 'for the public Foundry module endpoints' do
      before { stub_no_auth }

      it 'still serves tags, the map list, and free map files without auth' do
        get '/v1/maps/tags'
        expect(response).to have_http_status(:success)

        get '/v1/maps/list'
        expect(response).to have_http_status(:success)

        get "/v1/maps/files/#{map.id}"
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe 'GET /v1/maps-admin' do
    it 'redirects to the admin dashboard page' do
      get '/v1/maps-admin'

      expect(response).to redirect_to('/app/admin-dashboard/foundry-maps')
    end
  end
end
