require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::ScenesController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:token) { ApiToken.issue!(user: user, name: 'Foundry') }
  let(:headers) { { 'Authorization' => "Bearer #{token.plaintext_token}" } }
  let(:world) { { id: 'greyhawk', title: 'Greyhawk' } }
  let(:webp) { "RIFF\x24\x00\x00\x00WEBPVP8 ".b + ("\x00" * 24).b }
  let(:scene) do
    { uuid: 'Scene.a1B2c3D4e5F6g7H8', name: 'Mountain Pass', version: '1-abc',
      thumbnail: "data:image/webp;base64,#{Base64.strict_encode64(webp)}" }
  end
  let(:s3) { instance_double(Aws::S3::Client, put_object: true, delete_object: true) }

  before do
    allow(Aws::S3::Client).to receive(:new).and_return(s3)
    allow(ENV).to receive(:fetch).and_call_original
    allow(ENV).to receive(:fetch).with('AWS_S3_BUCKET', nil).and_return('test-bucket')
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with('AWS_REGION').and_return('us-east-1')
  end

  describe 'POST /v1/foundry/scenes' do
    it "uploads the scene's thumbnail to the public thumbnails path" do
      post '/v1/foundry/scenes', params: { world: world, scene: scene }, headers: headers, as: :json

      expect(response).to have_http_status(:success)
      saved = user.foundry_scenes.sole
      expect(saved).to have_attributes(world_id: 'greyhawk', world_title: 'Greyhawk', name: 'Mountain Pass', version: '1-abc')
      expect(saved.thumbnail_s3_key).to match(%r{\Athumbnails/scenes/#{user.id}/[\w-]+\.webp\z})
      expect(s3).to have_received(:put_object).with(
        bucket: 'test-bucket', key: saved.thumbnail_s3_key, body: webp, content_type: 'image/webp'
      )
      expect(json).to eq(
        'uuid' => 'Scene.a1B2c3D4e5F6g7H8', 'name' => 'Mountain Pass', 'version' => '1-abc', 'worldId' => 'greyhawk',
        'thumbnailUrl' => "https://test-bucket.s3.us-east-1.amazonaws.com/#{saved.thumbnail_s3_key}"
      )
    end

    it 'rejects a thumbnail that is not an image' do
      post '/v1/foundry/scenes', params: { world: world, scene: scene.merge(thumbnail: 'data:text/html;base64,PGI+') },
                                 headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['The thumbnail must be a WebP, JPEG or PNG data URL'])
      expect(s3).not_to have_received(:put_object)
    end

    it 'rejects a scene that is not from the world' do
      post '/v1/foundry/scenes', params: { world: world, scene: scene.merge(uuid: 'Compendium.x.y.Scene.a1B2c3D4e5F6g7H8') },
                                 headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['Foundry uuid is invalid'])
    end

    it 'needs a scene' do
      post '/v1/foundry/scenes', params: { world: world }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['scene must have a uuid, name, version and thumbnail'])
    end

    it 'needs a world' do
      post '/v1/foundry/scenes', params: { scene: scene }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to eq(['world must have an id'])
    end

    it 'says so when S3 fails' do
      allow(s3).to receive(:put_object).and_raise(Aws::S3::Errors::ServiceError.new(nil, 'Slow down'))

      post '/v1/foundry/scenes', params: { world: world, scene: scene }, headers: headers, as: :json

      expect(response).to have_http_status(:bad_gateway)
      expect(user.foundry_scenes).to be_empty
    end

    it 'needs a valid API token' do
      post '/v1/foundry/scenes', params: { world: world, scene: scene }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /v1/foundry/scenes' do
    it "lists the world's scene thumbnails" do
      pass = create(:foundry_scene, user: user, name: 'Mountain Pass', version: '1-abc')
      create(:foundry_scene, user: user, world_id: 'other')
      create(:foundry_scene, world_id: 'greyhawk')

      get '/v1/foundry/scenes', params: { world: 'greyhawk' }, headers: headers

      expect(response).to have_http_status(:success)
      expect(json).to eq(
        'scenes' => { pass.foundry_uuid => { 'name' => 'Mountain Pass', 'version' => '1-abc', 'thumbnailUrl' => pass.thumbnail_url } }
      )
    end

    it 'needs a world' do
      get '/v1/foundry/scenes', headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE /v1/foundry/scenes' do
    let!(:pass) { create(:foundry_scene, user: user, foundry_uuid: 'Scene.a1B2c3D4e5F6g7H8') }

    it "deletes the world's scene and its thumbnail" do
      copy = create(:foundry_scene, user: user, foundry_uuid: pass.foundry_uuid, world_id: 'other')

      delete '/v1/foundry/scenes', params: { world: 'greyhawk', uuid: pass.foundry_uuid }, headers: headers

      expect(response).to have_http_status(:no_content)
      expect(FoundryScene.exists?(pass.id)).to be false
      expect(FoundryScene.exists?(copy.id)).to be true
      expect(s3).to have_received(:delete_object).with(bucket: 'test-bucket', key: pass.thumbnail_s3_key)
    end

    it 'returns 404 for a scene that is not in the world, or not the DM\'s' do
      create(:foundry_scene, foundry_uuid: 'Scene.zzzzzzzzzzzzzzzz')

      [{ world: 'other', uuid: pass.foundry_uuid }, { world: 'greyhawk', uuid: 'Scene.zzzzzzzzzzzzzzzz' },
       { world: 'greyhawk' }].each do |query|
        delete '/v1/foundry/scenes', params: query, headers: headers

        expect(response).to have_http_status(:not_found), "expected #{query.inspect} to be not found"
        expect(json).to eq('errors' => ['Scene not found'])
      end
      expect(FoundryScene.count).to eq(2)
      expect(s3).not_to have_received(:delete_object)
    end

    it 'needs a world' do
      delete '/v1/foundry/scenes', params: { uuid: pass.foundry_uuid }, headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
      expect(FoundryScene.exists?(pass.id)).to be true
    end

    it 'needs a valid API token' do
      delete '/v1/foundry/scenes', params: { world: 'greyhawk', uuid: pass.foundry_uuid }

      expect(response).to have_http_status(:unauthorized)
      expect(FoundryScene.exists?(pass.id)).to be true
    end
  end
end
