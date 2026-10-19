require 'rails_helper'

RSpec.describe 'Admin::V1::Foundry::LinksController', type: :request do
  let(:user) { create(:dungeon_master_user, name: 'Dorman Lakely') }

  # Not memoized: several requests are made in one example
  def json
    response.parsed_body
  end

  def start_link(world = { id: 'abc123', title: 'Dev' })
    post '/v1/foundry/link', params: { world: world }, as: :json
    json
  end

  def poll(device_code)
    post '/v1/foundry/link/token', params: { deviceCode: device_code }, as: :json
  end

  describe 'POST /v1/foundry/link' do
    it 'starts a link without authentication' do
      start_link

      expect(response).to have_http_status(:created)
      expect(json['deviceCode'].length).to be >= 40
      expect(json['userCode']).to match(/\A[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}\z/)
      expect(json['verificationUrl']).to eq('http://www.example.com/link')
      expect(json['verificationUrlComplete']).to eq("http://www.example.com/link?code=#{json['userCode']}")
      expect(json['expiresIn']).to eq(600)
      expect(json['interval']).to eq(5)
    end

    it 'stores the world but only a digest of the device code' do
      start_link

      link = DeviceLink.last
      expect(link.world_id).to eq('abc123')
      expect(link.world_title).to eq('Dev')
      expect(link.device_code_digest).to eq(DeviceLink.digest(json['deviceCode']))
      expect(DeviceLink.where(device_code_digest: json['deviceCode'])).to be_empty
    end

    it 'uses the host the module called' do
      post '/v1/foundry/link', headers: { 'Host' => 'localhost:3000' }, as: :json

      expect(json['verificationUrl']).to eq('http://localhost:3000/link')
    end

    it 'works without a world' do
      post '/v1/foundry/link', as: :json

      expect(response).to have_http_status(:created)
      expect(DeviceLink.last.world_title).to be_nil
    end

    it 'ignores a world that is not an object' do
      post '/v1/foundry/link', params: { world: 'Dev' }, as: :json

      expect(response).to have_http_status(:created)
      expect(DeviceLink.last.world_title).to be_nil
    end

    it 'allows cross-origin requests from Foundry' do
      post '/v1/foundry/link', headers: { 'Origin' => 'http://localhost:30000' }, as: :json

      expect(response.headers['Access-Control-Allow-Origin']).to eq('*')
    end

    describe 'rate limiting' do
      let(:cache) { ActiveSupport::Cache::MemoryStore.new }

      before { allow(Rails).to receive(:cache).and_return(cache) }

      it 'allows 10 a minute from one IP address, then returns 429' do
        travel_to Time.zone.local(2026, 10, 19, 12, 0, 5) do
          10.times do
            post '/v1/foundry/link', as: :json
            expect(response).to have_http_status(:created)
          end

          post '/v1/foundry/link', as: :json
        end

        expect(response).to have_http_status(:too_many_requests)
        expect(json['error']).to eq('rate_limited')
        expect(response.headers['Retry-After']).to eq('55')
        expect(DeviceLink.count).to eq(10)
      end

      it 'counts each IP address separately' do
        travel_to Time.zone.local(2026, 10, 19, 12, 0, 5) do
          10.times { post '/v1/foundry/link', as: :json }
          post '/v1/foundry/link', headers: { 'REMOTE_ADDR' => '10.0.0.2' }, as: :json
        end

        expect(response).to have_http_status(:created)
      end

      it 'allows more in the next minute' do
        travel_to Time.zone.local(2026, 10, 19, 12, 0, 5) do
          11.times { post '/v1/foundry/link', as: :json }
        end
        travel_to Time.zone.local(2026, 10, 19, 12, 1, 0) do
          post '/v1/foundry/link', as: :json
        end

        expect(response).to have_http_status(:created)
      end
    end
  end

  describe 'POST /v1/foundry/link/token' do
    let(:started) { start_link }
    let(:device_code) { started['deviceCode'] }
    let(:link) { DeviceLink.for_device_code(device_code) }

    it 'is pending until the user approves' do
      poll(device_code)

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'authorization_pending')
    end

    it 'asks the module to slow down when it polls too fast' do
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 0) do
        device_code
        poll(device_code)
      end
      travel_to Time.zone.local(2026, 10, 19, 12, 0, 2) do
        poll(device_code)
      end

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'slow_down')
    end

    it 'returns the token once after approval, then expired_token' do
      link.approve!(user)

      poll(device_code)

      expect(response).to have_http_status(:ok)
      expect(json['user']).to eq('name' => 'Dorman Lakely')
      expect(json['token']).to start_with(ApiToken::PREFIX)
      token = ApiToken.authenticate(json['token'])
      expect(token.user).to eq(user)
      expect(token.name).to eq('Foundry: Dev')
      expect(link.reload.consumed_at).to be_present

      poll(device_code)

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'expired_token')
      expect(user.api_tokens.count).to eq(1)
    end

    it 'names the token Foundry when the world has no title' do
      post '/v1/foundry/link', as: :json
      code = json['deviceCode']
      DeviceLink.for_device_code(code).approve!(user)

      poll(code)

      expect(ApiToken.authenticate(json['token']).name).to eq('Foundry')
    end

    it 'falls back to the username when the user has no name' do
      user.update!(name: nil)
      link.approve!(user)

      poll(device_code)

      expect(json['user']).to eq('name' => user.username)
    end

    it 'reports a denial' do
      link.deny!

      poll(device_code)

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'access_denied')
    end

    it 'reports access_denied when the user has run out of API tokens' do
      link.approve!(user)
      ApiToken::MAX_PER_USER.times { |i| ApiToken.issue!(user: user, name: "Token #{i}") }

      poll(device_code)

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'access_denied')
    end

    it 'reports expired_token after 10 minutes' do
      device_code
      travel 10.minutes + 1.second do
        poll(device_code)
      end

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'expired_token')
    end

    it 'reports expired_token for an unknown code' do
      poll('not-a-real-code')

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'expired_token')
    end

    it 'reports expired_token when no code is sent' do
      post '/v1/foundry/link/token', as: :json

      expect(response).to have_http_status(:bad_request)
      expect(json).to eq('error' => 'expired_token')
    end

    it 'does not accept the short user code' do
      poll(started['userCode'])

      expect(json).to eq('error' => 'expired_token')
    end
  end
end
