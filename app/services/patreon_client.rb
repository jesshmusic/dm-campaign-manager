# frozen_string_literal: true

require 'json'
require 'net/http'
require 'openssl'

# Talks to Patreon's OAuth token endpoint and identity API. Shared by the
# OAuth callback (Admin::V1::PatreonAuthController) and PatreonMembership's
# token refresh.
class PatreonClient
  TOKEN_URL = 'https://www.patreon.com/api/oauth2/token'
  IDENTITY_URL = 'https://www.patreon.com/api/oauth2/v2/identity'
  # Memberships cover every creator the patron supports; the campaign
  # relationship tells PatreonMembership which one is ours
  IDENTITY_PARAMS = {
    'include' => 'memberships,memberships.currently_entitled_tiers,memberships.campaign',
    'fields[member]' => 'patron_status,currently_entitled_amount_cents',
    'fields[tier]' => 'title',
    'fields[user]' => 'email,full_name'
  }.freeze

  # Patreon refreshes also run inside Foundry requests, so give up quickly
  OPEN_TIMEOUT = 5
  READ_TIMEOUT = 10

  NETWORK_ERRORS = [
    Timeout::Error, SocketError, SystemCallError, IOError,
    OpenSSL::SSL::SSLError, Net::ProtocolError, Net::HTTPBadResponse
  ].freeze

  class Error < StandardError; end
  # Patreon no longer accepts the token (invalid_grant or 401): the patron has to link again
  class RevokedError < Error; end
  # Network failure, rate limit or Patreon 5xx: worth trying again later
  class UnavailableError < Error; end

  class << self
    # Trades an OAuth authorization code for tokens
    def exchange_code(code)
      request_token('grant_type' => 'authorization_code', 'code' => code,
                    'redirect_uri' => ENV.fetch('PATREON_REDIRECT_URI', nil))
    end

    # Trades a refresh token for a new access token and refresh token
    def refresh_tokens(refresh_token)
      request_token('grant_type' => 'refresh_token', 'refresh_token' => refresh_token)
    end

    # The patron's identity, memberships and entitled tiers
    def identity(access_token)
      uri = URI(IDENTITY_URL)
      uri.query = URI.encode_www_form(IDENTITY_PARAMS)
      request = Net::HTTP::Get.new(uri)
      request['Authorization'] = "Bearer #{access_token}"
      parse(perform(uri, request), 'fetch membership')
    end

    private

    def request_token(params)
      uri = URI(TOKEN_URL)
      request = Net::HTTP::Post.new(uri)
      request.set_form_data(params.merge('client_id' => ENV.fetch('PATREON_CLIENT_ID', nil),
                                         'client_secret' => ENV.fetch('PATREON_CLIENT_SECRET', nil)))
      parse(perform(uri, request), 'exchange token')
    end

    def perform(uri, request)
      Net::HTTP.start(uri.hostname, uri.port, use_ssl: true, open_timeout: OPEN_TIMEOUT, read_timeout: READ_TIMEOUT) do |http|
        http.request(request)
      end
    rescue *NETWORK_ERRORS => e
      raise UnavailableError, "Patreon unreachable: #{e.class}: #{e.message}"
    end

    def parse(response, action)
      raise error_for(response), "Failed to #{action}: #{response.code} #{response.body}" unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)
    rescue JSON::ParserError => e
      raise Error, "Failed to #{action}: unreadable response (#{e.message})"
    end

    def error_for(response)
      status = response.code.to_i
      return RevokedError if status == 401 || invalid_grant?(response)
      return UnavailableError if status == 429 || status >= 500

      Error
    end

    def invalid_grant?(response)
      JSON.parse(response.body.to_s)['error'] == 'invalid_grant'
    rescue JSON::ParserError, TypeError
      false
    end
  end
end
