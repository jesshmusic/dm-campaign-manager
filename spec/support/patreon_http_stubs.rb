# Stubs Patreon's HTTP API at the Net::HTTP level, so specs exercise
# PatreonClient's request building and error handling. Include it in a spec
# that needs it.
module PatreonHttpStubs
  PATREON_TOKEN_PATH = '/api/oauth2/token'.freeze
  # DM Guru's campaign in these fixtures. Including specs set PATREON_CAMPAIGN_ID
  # to it, so they read memberships the way production does whatever .env says.
  PATREON_CAMPAIGN_ID = 'campaign_dmguru'.freeze

  def self.included(base)
    base.before { stub_patreon_campaign_id }
  end

  def stub_patreon_campaign_id(campaign_id = PATREON_CAMPAIGN_ID)
    allow(ENV).to receive(:fetch).and_call_original
    allow(ENV).to receive(:fetch).with('PATREON_CAMPAIGN_ID', nil).and_return(campaign_id)
  end

  # Each of `token` and `identity` is a [status, body] pair, or an exception
  # to raise as if the network failed. Returns the requests made, in order.
  def stub_patreon_http(token: nil, identity: nil)
    requests = []
    http = instance_double(Net::HTTP)
    allow(http).to receive(:request) do |request|
      requests << request
      outcome = request.path.start_with?(PATREON_TOKEN_PATH) ? token : identity
      raise outcome if outcome.is_a?(Exception)

      patreon_response(*outcome)
    end
    allow(Net::HTTP).to receive(:start) { |*_args, **_options, &block| block.call(http) }
    requests
  end

  def patreon_response(status, body)
    response = Net::HTTPResponse::CODE_TO_OBJ.fetch(status.to_s).new('1.1', status.to_s, '')
    allow(response).to receive(:body).and_return(body.is_a?(String) ? body : body.to_json)
    response
  end

  def patreon_token_body(access_token: 'new_access_token', refresh_token: 'new_refresh_token', expires_in: 2_678_400)
    { 'access_token' => access_token, 'refresh_token' => refresh_token, 'expires_in' => expires_in,
      'token_type' => 'Bearer', 'scope' => 'identity identity.memberships' }
  end

  # The identity API's answer for a patron. Pass `memberships` (from
  # patreon_membership) to give them several, or the keywords for just one.
  def patreon_identity_body(patreon_id: 'patreon_123', memberships: nil, **membership)
    included = (memberships || [patreon_membership(**membership)]).flatten
    member_refs = included.select { |item| item['type'] == 'member' }.map { |item| item.slice('id', 'type') }
    {
      'data' => { 'id' => patreon_id, 'type' => 'user',
                  'attributes' => { 'email' => 'patron@example.com', 'full_name' => 'Pat Ron' },
                  'relationships' => { 'memberships' => { 'data' => member_refs } } },
      'included' => included
    }
  end

  # One membership as the identity API includes it: the member, the tier it
  # entitles them to (none when `tier` is nil) and its campaign
  def patreon_membership(cents: 500, tier: 'Wizard', status: 'active_patron', campaign_id: PATREON_CAMPAIGN_ID, id: 'member_1')
    tier_refs = tier ? [{ 'id' => "#{id}_tier", 'type' => 'tier' }] : []
    member = {
      'id' => id, 'type' => 'member',
      'attributes' => { 'currently_entitled_amount_cents' => cents, 'patron_status' => status },
      'relationships' => { 'campaign' => { 'data' => { 'id' => campaign_id, 'type' => 'campaign' } },
                           'currently_entitled_tiers' => { 'data' => tier_refs } }
    }
    tiers = tier_refs.map { |ref| ref.merge('attributes' => { 'title' => tier }) }
    [member, *tiers, { 'id' => campaign_id, 'type' => 'campaign' }]
  end
end
