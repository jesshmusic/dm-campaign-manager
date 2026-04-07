# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'

# Fetches Foundry VTT module install statistics from GitHub for a hardcoded
# list of repos owned by jesshmusic. Used by the admin Foundry Module Stats
# page (Admin::V1::FoundryModuleStatsController).
#
# Each "module" is a public GitHub repo whose releases are zip packages of a
# Foundry module. Install counts come from the GitHub release-asset
# `download_count` field, summed across .zip assets in each release.
#
# To bucket the latest installs by Foundry major version (v13 vs v14), we
# walk releases newest-to-oldest and read each release's `module.json`
# manifest from raw.githubusercontent.com. The first release we find that
# targets a given major version (via `compatibility.verified` or
# `compatibility.minimum`) becomes the "latest for v{major}".
class FoundryModuleStatsFetcher
  OWNER = 'jesshmusic'
  REPOS = [
    { name: 'Tile Utilities',        repo: 'em-tile-utilities' },
    { name: 'NPC Generator',         repo: 'dorman-lakelys-npc-generator' },
    { name: 'CR Calculator',         repo: 'fvtt-challenge-calculator' },
    { name: 'Crit & Fumble Tables',  repo: 'dorman-lakelys-crit-fumble-tables' },
    { name: 'Playlist Enhancements', repo: 'dorman-lakelys-playlist-enhancements' },
    { name: 'Legendary Actions',     repo: 'dormanlakely-legendary-actions' },
    { name: 'Cartography',           repo: 'dorman-lakely-cartography' }
  ].freeze
  WANTED_MAJORS = [13, 14].freeze
  USER_AGENT = 'dungeon-master-guru-admin'

  def initialize(token: ENV.fetch('GITHUB_TOKEN', nil))
    @token = token.to_s.strip.presence
  end

  def call
    {
      fetched_at: Time.current.iso8601,
      owner: OWNER,
      modules: REPOS.map { |mod| fetch_module(mod) }
    }
  end

  private

  def fetch_module(mod)
    repo = mod[:repo]
    repo_data = fetch_json("https://api.github.com/repos/#{OWNER}/#{repo}")
    releases  = fetch_json("https://api.github.com/repos/#{OWNER}/#{repo}/releases") || []

    per_version = find_latest_per_version(repo, releases)

    {
      name: mod[:name],
      repo: repo,
      repo_url: "https://github.com/#{OWNER}/#{repo}",
      issues_url: "https://github.com/#{OWNER}/#{repo}/issues",
      open_issues_count: repo_data&.dig('open_issues_count') || 0,
      latest_installs: latest_installs(releases),
      total_installs: releases.sum { |r| zip_count(r) },
      v13: serialize_version(per_version[13]),
      v14: serialize_version(per_version[14]),
      releases: releases.map { |r| serialize_release(r) },
      error: nil
    }
  rescue StandardError => e
    Rails.logger.warn("FoundryModuleStatsFetcher: #{mod[:repo]} failed — #{e.class}: #{e.message}")
    {
      name: mod[:name],
      repo: mod[:repo],
      repo_url: "https://github.com/#{OWNER}/#{mod[:repo]}",
      issues_url: "https://github.com/#{OWNER}/#{mod[:repo]}/issues",
      open_issues_count: 0,
      latest_installs: 0,
      total_installs: 0,
      v13: nil,
      v14: nil,
      releases: [],
      error: e.message
    }
  end

  def serialize_release(release)
    {
      tag: release['tag_name'],
      published_at: release['published_at'],
      installs: zip_count(release)
    }
  end

  def serialize_version(info)
    return nil unless info

    {
      version: info[:version],
      tag: info[:tag],
      count: info[:count]
    }
  end

  def zip_count(release)
    Array(release['assets'])
      .select { |a| a['name'].to_s.end_with?('.zip') }
      .sum { |a| a['download_count'].to_i }
  end

  def latest_installs(releases)
    return 0 if releases.empty?

    zip_count(releases.first)
  end

  # Walks releases newest-to-oldest, fetching each release's module.json,
  # and returns the latest release per Foundry major version we care about.
  # Stops once all wanted majors are found or releases are exhausted.
  def find_latest_per_version(repo, releases)
    results = {}
    releases.each do |release|
      break if WANTED_MAJORS.all? { |v| results[v] }

      manifest = fetch_manifest_for_release(repo, release)
      major = manifest_major_version(manifest)
      next unless major && WANTED_MAJORS.include?(major) && results[major].nil?

      results[major] = {
        version: manifest['version'] || release['tag_name'],
        tag: release['tag_name'],
        count: zip_count(release)
      }
    end
    results
  end

  # Fetch the module.json for a given release tag from raw.githubusercontent.com
  # (the GitHub release-asset URL itself redirects to a host without CORS
  # headers — not a problem server-side, but raw.githubusercontent.com is
  # simpler and faster). Tries the tag as-is first, then without a leading "v"
  # in case the manifest was committed under that variant.
  def fetch_manifest_for_release(repo, release)
    tag = release['tag_name'].to_s
    return nil if tag.empty?

    candidates = [tag]
    candidates << tag.delete_prefix('v') if tag.start_with?('v')

    candidates.each do |candidate|
      url = "https://raw.githubusercontent.com/#{OWNER}/#{repo}/#{ERB::Util.url_encode(candidate)}/module.json"
      manifest = fetch_json(url)
      return manifest if manifest.is_a?(Hash)
    end
    nil
  end

  def manifest_major_version(manifest)
    return nil unless manifest.is_a?(Hash)

    compatibility = manifest['compatibility']
    return nil unless compatibility.is_a?(Hash)

    raw = (compatibility['verified'] || compatibility['minimum']).to_s
    match = raw.match(/^(\d+)/)
    match ? match[1].to_i : nil
  end

  def fetch_json(url)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req['Accept'] = 'application/vnd.github+json'
    req['User-Agent'] = USER_AGENT
    req['Authorization'] = "Bearer #{@token}" if @token

    response = Net::HTTP.start(uri.hostname, uri.port,
                               use_ssl: true, open_timeout: 5, read_timeout: 15) do |http|
      http.request(req)
    end

    return nil unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body)
  rescue JSON::ParserError, Net::OpenTimeout, Net::ReadTimeout, SocketError => e
    Rails.logger.warn("FoundryModuleStatsFetcher#fetch_json #{url} -> #{e.class}: #{e.message}")
    nil
  end
end
