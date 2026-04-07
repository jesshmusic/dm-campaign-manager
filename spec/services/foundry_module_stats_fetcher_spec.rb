require 'rails_helper'

require_relative '../../app/services/foundry_module_stats_fetcher'

RSpec.describe FoundryModuleStatsFetcher do
  subject(:fetcher) { described_class.new(token: nil) }

  # Stub the private fetch_json method so we don't hit the network. Each
  # URL maps to a canned response (or nil for "not found").
  def stub_http(url_to_response)
    allow(fetcher).to receive(:fetch_json) do |url|
      url_to_response.fetch(url, nil)
    end
  end

  describe '#call' do
    it 'returns owner, fetched_at, rate_limited, and a module entry per repo' do
      allow(fetcher).to receive(:fetch_json).and_return(nil)
      result = fetcher.call

      expect(result[:owner]).to eq('jesshmusic')
      expect(result[:fetched_at]).to be_a(String)
      expect(result[:rate_limited]).to be(false)
      expect(result[:modules].length).to eq(described_class::REPOS.length)
    end

    it 'flags rate_limited when any repo fetch hits the GitHub limit' do
      allow(fetcher)
        .to receive(:fetch_json)
        .and_raise(FoundryModuleStatsFetcher::RateLimitError.new('quota exhausted'))

      result = fetcher.call
      expect(result[:rate_limited]).to be(true)
      expect(result[:modules]).to all(include(error: a_string_matching(/rate limited/)))
    end

    it 'aggregates install counts and buckets the latest releases by Foundry version' do
      repo_url = 'https://api.github.com/repos/jesshmusic/em-tile-utilities'
      releases_url = "#{repo_url}/releases"

      releases = [
        {
          'tag_name' => 'v2.1.0',
          'published_at' => '2026-03-01T00:00:00Z',
          'assets' => [
            { 'name' => 'em-tile-utilities.zip', 'download_count' => 50 },
            { 'name' => 'module.json', 'download_count' => 999 } # ignored, not a zip
          ]
        },
        {
          'tag_name' => 'v1.5.0',
          'published_at' => '2025-12-01T00:00:00Z',
          'assets' => [
            { 'name' => 'em-tile-utilities.zip', 'download_count' => 30 }
          ]
        }
      ]

      url_map = {
        repo_url => { 'open_issues_count' => 4 },
        releases_url => releases,
        'https://raw.githubusercontent.com/jesshmusic/em-tile-utilities/v2.1.0/module.json' =>
          { 'version' => '2.1.0', 'compatibility' => { 'verified' => '14' } },
        'https://raw.githubusercontent.com/jesshmusic/em-tile-utilities/v1.5.0/module.json' =>
          { 'version' => '1.5.0', 'compatibility' => { 'verified' => '13' } }
      }

      # All other repos return nil so they're built as empty/error rows.
      allow(fetcher).to receive(:fetch_json) { |url| url_map[url] }

      result = fetcher.call
      tile = result[:modules].find { |m| m[:repo] == 'em-tile-utilities' }

      expect(tile[:open_issues_count]).to eq(4)
      expect(tile[:latest_installs]).to eq(50)
      expect(tile[:total_installs]).to eq(80)
      expect(tile[:v13]).to eq(version: '1.5.0', tag: 'v1.5.0', count: 30)
      expect(tile[:v14]).to eq(version: '2.1.0', tag: 'v2.1.0', count: 50)
      expect(tile[:releases].map { |r| r[:tag] }).to eq(%w[v2.1.0 v1.5.0])
      expect(tile[:error]).to be_nil
    end

    it 'falls back from compatibility.verified to compatibility.minimum for version detection' do
      repo_url = 'https://api.github.com/repos/jesshmusic/em-tile-utilities'
      releases = [
        { 'tag_name' => 'v1.0.0', 'published_at' => '2025-01-01T00:00:00Z',
          'assets' => [{ 'name' => 'mod.zip', 'download_count' => 10 }] }
      ]
      url_map = {
        repo_url => { 'open_issues_count' => 0 },
        "#{repo_url}/releases" => releases,
        'https://raw.githubusercontent.com/jesshmusic/em-tile-utilities/v1.0.0/module.json' =>
          { 'version' => '1.0.0', 'compatibility' => { 'minimum' => '13.0.0' } }
      }
      allow(fetcher).to receive(:fetch_json) { |url| url_map[url] }

      result = fetcher.call
      tile = result[:modules].find { |m| m[:repo] == 'em-tile-utilities' }
      expect(tile[:v13]).to include(version: '1.0.0', count: 10)
    end

    it 'returns an error entry for a repo that raises during fetch' do
      allow(fetcher).to receive(:fetch_json).and_raise(StandardError.new('boom'))

      result = fetcher.call
      first = result[:modules].first
      expect(first[:error]).to eq('boom')
      expect(first[:latest_installs]).to eq(0)
      expect(first[:releases]).to eq([])
    end
  end
end
