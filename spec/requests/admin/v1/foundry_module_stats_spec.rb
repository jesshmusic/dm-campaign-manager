require 'rails_helper'

require_relative '../../../../app/services/foundry_module_stats_fetcher'

RSpec.describe 'Admin::V1::FoundryModuleStats', type: :request do
  let(:fixture_payload) do
    {
      fetched_at: '2026-04-07T12:00:00Z',
      owner: 'jesshmusic',
      modules: [
        {
          name: 'Tile Utilities',
          repo: 'em-tile-utilities',
          repo_url: 'https://github.com/jesshmusic/em-tile-utilities',
          issues_url: 'https://github.com/jesshmusic/em-tile-utilities/issues',
          open_issues_count: 2,
          latest_installs: 100,
          total_installs: 500,
          v13: { version: '1.2.3', tag: 'v1.2.3', count: 80 },
          v14: { version: '2.0.0', tag: 'v2.0.0', count: 20 },
          releases: [
            { tag: 'v2.0.0', published_at: '2026-03-01T00:00:00Z', installs: 20 },
            { tag: 'v1.2.3', published_at: '2025-12-01T00:00:00Z', installs: 80 }
          ],
          error: nil
        }
      ]
    }
  end

  let(:fetcher) { instance_double(FoundryModuleStatsFetcher, call: fixture_payload) }
  let(:memory_cache) { ActiveSupport::Cache::MemoryStore.new }

  before do
    # The default test cache is NullStore, which silently no-ops, so the
    # cache hit/miss assertions below need a real in-memory store.
    allow(Rails).to receive(:cache).and_return(memory_cache)
    allow(FoundryModuleStatsFetcher).to receive(:new).and_return(fetcher)
  end

  describe 'GET /v1/foundry-module-stats' do
    context 'when user is an admin' do
      let(:admin) { create(:admin_user) }

      before { stub_authentication(admin) }

      it 'returns 200' do
        get '/v1/foundry-module-stats', as: :json
        expect(response).to have_http_status(:success)
      end

      it 'returns the fetcher payload as JSON' do
        get '/v1/foundry-module-stats', as: :json
        body = JSON.parse(response.body)
        expect(body['owner']).to eq('jesshmusic')
        expect(body['modules'].first['name']).to eq('Tile Utilities')
        expect(body['modules'].first['v13']['version']).to eq('1.2.3')
      end

      it 'caches the response across requests' do
        get '/v1/foundry-module-stats', as: :json
        get '/v1/foundry-module-stats', as: :json
        expect(FoundryModuleStatsFetcher).to have_received(:new).once
      end

      it 'busts the cache when refresh=1 is passed' do
        get '/v1/foundry-module-stats', as: :json
        get '/v1/foundry-module-stats', params: { refresh: 1 }, as: :json
        expect(FoundryModuleStatsFetcher).to have_received(:new).twice
      end
    end

    context 'when user is not an admin' do
      let(:user) { create(:user) }

      before { stub_authentication(user) }

      it 'returns forbidden' do
        get '/v1/foundry-module-stats', as: :json
        expect(response).to have_http_status(:forbidden)
      end

      it 'does not call the fetcher' do
        get '/v1/foundry-module-stats', as: :json
        expect(FoundryModuleStatsFetcher).not_to have_received(:new)
      end
    end

    context 'when the user is not authenticated' do
      before { stub_no_auth }

      it 'returns forbidden or unauthorized' do
        get '/v1/foundry-module-stats', as: :json
        expect(response).to have_http_status(:forbidden).or have_http_status(:unauthorized)
      end
    end
  end
end
