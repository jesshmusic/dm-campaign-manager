require 'rails_helper'

RSpec.describe PatreonClient do
  include PatreonHttpStubs

  before do
    allow(ENV).to receive(:fetch).and_call_original
    allow(ENV).to receive(:fetch).with('PATREON_CLIENT_ID', nil).and_return('client-123')
    allow(ENV).to receive(:fetch).with('PATREON_CLIENT_SECRET', nil).and_return('secret-456')
    allow(ENV).to receive(:fetch).with('PATREON_REDIRECT_URI', nil).and_return('https://dmguru.test/v1/patreon/callback')
  end

  describe '.refresh_tokens' do
    it 'posts a refresh_token grant with the client credentials' do
      requests = stub_patreon_http(token: [200, patreon_token_body])

      expect(described_class.refresh_tokens('old_refresh')).to include('access_token' => 'new_access_token')

      form = Rack::Utils.parse_query(requests.first.body)
      expect(requests.first.path).to eq('/api/oauth2/token')
      expect(form).to eq('grant_type' => 'refresh_token', 'refresh_token' => 'old_refresh',
                         'client_id' => 'client-123', 'client_secret' => 'secret-456')
    end

    it 'connects to Patreon over TLS with short timeouts' do
      stub_patreon_http(token: [200, patreon_token_body])

      described_class.refresh_tokens('old_refresh')

      expect(Net::HTTP).to have_received(:start)
        .with('www.patreon.com', 443, use_ssl: true, open_timeout: described_class::OPEN_TIMEOUT, read_timeout: described_class::READ_TIMEOUT)
    end

    it 'raises RevokedError when Patreon answers invalid_grant' do
      stub_patreon_http(token: [400, { 'error' => 'invalid_grant' }])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::RevokedError)
    end

    it 'raises RevokedError on a 401' do
      stub_patreon_http(token: [401, { 'error' => 'invalid_client' }])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::RevokedError)
    end

    it 'raises UnavailableError on a Patreon 5xx' do
      stub_patreon_http(token: [503, '<html>Service Unavailable</html>'])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::UnavailableError)
    end

    it 'raises UnavailableError when rate limited' do
      stub_patreon_http(token: [429, { 'error' => 'rate_limited' }])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::UnavailableError)
    end

    it 'raises UnavailableError when the network fails' do
      [SocketError.new('getaddrinfo failed'), Net::OpenTimeout.new('execution expired'), Errno::ECONNRESET.new].each do |failure|
        stub_patreon_http(token: failure)

        expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::UnavailableError)
      end
    end

    it 'raises a plain Error for other rejections' do
      stub_patreon_http(token: [400, { 'error' => 'invalid_request' }])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::Error) { |error|
        expect(error).not_to be_a(described_class::RevokedError)
        expect(error).not_to be_a(described_class::UnavailableError)
      }
    end

    it 'raises a plain Error for an unreadable success body' do
      stub_patreon_http(token: [200, 'not json'])

      expect { described_class.refresh_tokens('old_refresh') }.to raise_error(described_class::Error, /unreadable/)
    end
  end

  describe '.exchange_code' do
    it 'posts an authorization_code grant with the redirect URI' do
      requests = stub_patreon_http(token: [200, patreon_token_body])

      described_class.exchange_code('auth-code')

      expect(Rack::Utils.parse_query(requests.first.body)).to include(
        'grant_type' => 'authorization_code', 'code' => 'auth-code',
        'redirect_uri' => 'https://dmguru.test/v1/patreon/callback', 'client_id' => 'client-123'
      )
    end
  end

  describe '.identity' do
    it 'fetches memberships with the access token' do
      requests = stub_patreon_http(identity: [200, patreon_identity_body])

      expect(described_class.identity('access-abc').dig('data', 'id')).to eq('patreon_123')

      request = requests.first
      expect(request['Authorization']).to eq('Bearer access-abc')
      expect(request.path).to start_with('/api/oauth2/v2/identity?')
      expect(Rack::Utils.parse_query(URI(request.path).query)).to include(
        'include' => 'memberships,memberships.currently_entitled_tiers,memberships.campaign',
        'fields[member]' => 'patron_status,currently_entitled_amount_cents'
      )
    end

    it 'raises RevokedError when the access token is rejected' do
      stub_patreon_http(identity: [401, { 'errors' => [{ 'code_name' => 'Unauthorized' }] }])

      expect { described_class.identity('access-abc') }.to raise_error(described_class::RevokedError)
    end
  end
end
