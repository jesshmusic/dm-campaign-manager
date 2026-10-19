# frozen_string_literal: true

# Keeps PatreonUser rows in step with Patreon. The access token Patreon issues
# expires after about a month and `expires_at` follows it, so without a
# refresh a paying patron would lose premium and a cancelled one would keep it
# until then. Four callers:
# - the OAuth callback builds a row from `attributes`
# - `patreon:refresh_memberships` (daily) calls `refresh_due` for PatreonUser.due_for_refresh
# - premium checks call `refresh_if_stale` so a lapsed patron recovers at once
# - the Patreon webhook (PatreonWebhooksController) calls `refresh` when a pledge changes
# User#premium? stays a plain read; only these methods make HTTP calls.
class PatreonMembership
  PREMIUM_CENTS = 500 # $5+ tier
  DEFAULT_TOKEN_LIFETIME = 30.days

  # Lazy refresh: try when the token is this close to expiring, at most once per interval
  STALE_WITHIN = 1.day
  LAZY_REFRESH_INTERVAL = 1.hour

  # The only patron_status that earns premium
  ACTIVE_PATRON = 'active_patron'

  class << self
    # Row attributes from a token response and the identity API's membership
    # data. Premium and the tier come from the patron's membership of our
    # campaign only (PATREON_CAMPAIGN_ID), never from pledges to other creators.
    def attributes(token_response, patreon_data)
      membership = our_membership(patreon_data)
      {
        patreon_id: patreon_data.dig('data', 'id'),
        email: patreon_data.dig('data', 'attributes', 'email'),
        name: patreon_data.dig('data', 'attributes', 'full_name'),
        has_free: true,
        has_premium: premium?(membership),
        tier_name: tier_name(patreon_data, membership),
        expires_at: token_expiry(token_response),
        access_token: token_response['access_token'],
        refresh_token: token_response['refresh_token']
      }
    end

    # Exchanges the refresh token and re-reads the membership. Returns
    # - :refreshed, with new tokens, expiry and premium/tier
    # - :revoked, Patreon refused the token: premium dropped, row kept for re-linking
    # - :failed, logged, premium and expiry left as they were
    # - :skipped, another request or the daily job refreshed it first
    def refresh(account)
      refresh_token = account.refresh_token
      # Patreon rotates refresh tokens, so two refreshes racing with the same
      # token would see the loser's invalid_grant revoke a good account. The row
      # lock serialises them, and the loser sees the token has already changed.
      account.with_lock do
        next :skipped if account.refresh_token.blank? || account.refresh_token != refresh_token

        renew(account)
      end
    rescue StandardError => e
      log_failure(account, e)
      :failed
    end

    # Refreshes every account due for it. Never raises; returns counts by outcome.
    def refresh_due(scope = PatreonUser.due_for_refresh)
      counts = { refreshed: 0, revoked: 0, failed: 0, skipped: 0 }
      scope.find_each do |account|
        counts[refresh(account)] += 1
      rescue StandardError => e
        log_failure(account, e)
        counts[:failed] += 1
      end
      counts
    end

    # For a request that checks premium: refreshes an expired or nearly expired
    # account, at most once per account per LAZY_REFRESH_INTERVAL so a failing
    # refresh doesn't reach Patreon on every request. Returns the refresh
    # outcome, or nil when nothing was tried.
    def refresh_if_stale(account)
      return unless stale?(account)
      return unless Rails.cache.write(lazy_refresh_key(account), true, expires_in: LAZY_REFRESH_INTERVAL, unless_exist: true)

      refresh(account)
    end

    def stale?(account)
      return false if account.nil? || account.refresh_token.blank?

      account.expires_at.nil? || account.expires_at <= STALE_WITHIN.from_now
    end

    def lazy_refresh_key(account)
      "patreon_membership/lazy_refresh/#{account.id}"
    end

    private

    def renew(account)
      tokens = PatreonClient.refresh_tokens(account.refresh_token)
      # Keep the rotated pair even if the membership fetch below fails
      account.update!(access_token: tokens['access_token'], refresh_token: tokens['refresh_token'].presence || account.refresh_token)
      identity = PatreonClient.identity(account.access_token)
      account.update_from_patreon!(attributes(tokens, identity).merge(refresh_token: account.refresh_token))
      :refreshed
    rescue PatreonClient::RevokedError => e
      revoke(account, e)
      :revoked
    rescue StandardError => e
      # Rescued inside the lock's transaction so the rotated tokens are still committed
      log_failure(account, e)
      :failed
    end

    def log_failure(account, error)
      Rails.logger.error("Patreon refresh failed for PatreonUser #{account.id}: #{error.class}: #{error.message}")
    end

    def revoke(account, error)
      Rails.logger.warn("Patreon revoked access for PatreonUser #{account.id}: #{error.message}")
      account.update!(has_premium: false, expires_at: nil, access_token: nil, refresh_token: nil)
    end

    # The patron's membership of our campaign, or nil if they don't support it.
    # Without PATREON_CAMPAIGN_ID we can't tell, so take the first membership.
    def our_membership(patreon_data)
      members = included(patreon_data).select { |item| item['type'] == 'member' }
      campaign_id = ENV.fetch('PATREON_CAMPAIGN_ID', nil).presence
      unless campaign_id
        warn_missing_campaign_id
        return members.first
      end

      members.find { |member| member.dig('relationships', 'campaign', 'data', 'id').to_s == campaign_id }
    end

    def premium?(membership)
      active_patron?(membership) && membership.dig('attributes', 'currently_entitled_amount_cents').to_i >= PREMIUM_CENTS
    end

    # Declined and former patrons (and followers who never pledged) get nothing
    def active_patron?(membership)
      membership&.dig('attributes', 'patron_status') == ACTIVE_PATRON
    end

    # The tier our membership entitles the patron to, or Free
    def tier_name(patreon_data, membership)
      name = entitled_tier(patreon_data, membership)&.dig('attributes', 'title') if active_patron?(membership)
      name ||= 'Free'
      # Map legacy tier names to current tiers
      name == 'Adventurer' ? 'Wizard' : name
    end

    def entitled_tier(patreon_data, membership)
      tier_ids = Array(membership.dig('relationships', 'currently_entitled_tiers', 'data')).pluck('id')
      included(patreon_data).find { |item| item['type'] == 'tier' && tier_ids.include?(item['id']) }
    end

    def included(patreon_data)
      patreon_data['included'] || []
    end

    # Once per process, so the daily job doesn't log it for every account
    def warn_missing_campaign_id
      return if @campaign_id_warning_logged

      @campaign_id_warning_logged = true
      Rails.logger.warn('PATREON_CAMPAIGN_ID is not set: Patreon premium is read from the first membership, ' \
                        'which may be a pledge to another creator')
    end

    def token_expiry(token_response)
      lifetime = token_response['expires_in'].to_i
      lifetime.positive? ? lifetime.seconds.from_now : DEFAULT_TOKEN_LIFETIME.from_now
    end
  end
end
