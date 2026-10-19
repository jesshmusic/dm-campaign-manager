# frozen_string_literal: true

require 'openssl'

module Admin
  module V1
    # Patreon calls this when someone joins, changes or cancels a membership of
    # our campaign, so premium follows Patreon at once instead of at the next
    # token refresh. Registered in the Patreon developer portal; Patreon signs
    # each request with PATREON_WEBHOOK_SECRET.
    class PatreonWebhooksController < ApplicationController
      skip_before_action :verify_authenticity_token

      HANDLED_EVENTS = %w[
        members:create members:update members:delete
        members:pledge:create members:pledge:update members:pledge:delete
      ].freeze
      DELETE_EVENTS = %w[members:delete members:pledge:delete].freeze

      # POST /v1/patreon/webhook
      # Answers 200 for anything signed, including events and patrons we don't
      # track, so Patreon doesn't keep retrying them.
      def create
        return head :unauthorized unless valid_signature?

        event = request.headers['X-Patreon-Event'].to_s
        patreon_id = member_user_id if HANDLED_EVENTS.include?(event)
        PatreonUser.where(patreon_id: patreon_id).find_each { |account| sync(account, event) } if patreon_id.present?
        head :ok
      end

      private

      # X-Patreon-Signature is the hex HMAC-MD5 of the raw body, keyed with the webhook secret
      def valid_signature?
        secret = ENV.fetch('PATREON_WEBHOOK_SECRET', nil)
        signature = request.headers['X-Patreon-Signature'].to_s
        return false if secret.blank? || signature.blank?

        expected = OpenSSL::HMAC.hexdigest('MD5', secret, request.raw_post)
        ActiveSupport::SecurityUtils.secure_compare(expected, signature.downcase)
      end

      # The member's Patreon user, which PatreonUser#patreon_id stores
      def member_user_id
        payload = JSON.parse(request.raw_post)
        payload.dig('data', 'relationships', 'user', 'data', 'id')&.to_s if payload.is_a?(Hash)
      rescue JSON::ParserError, TypeError
        nil
      end

      # Re-reads the membership from Patreon. A Foundry login and a web link
      # can share a Patreon user, so this runs for each of their rows. When
      # Patreon can't be asked (no refresh token, or the refresh failed), a
      # cancellation still ends premium.
      def sync(account, event)
        outcome = account.refresh_token.present? ? PatreonMembership.refresh(account) : :no_refresh_token
        account.update!(has_premium: false) if DELETE_EVENTS.include?(event) && %i[no_refresh_token failed].include?(outcome)
        Rails.logger.info("Patreon webhook #{event} for PatreonUser #{account.id}: #{outcome}")
      end
    end
  end
end
