# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Base for endpoints called by DM Guru's Foundry modules with a personal API token.
      class BaseController < ApplicationController
        include ApiTokenAuthentication

        # Token-authenticated, not cookie-authenticated, so CSRF does not apply
        skip_before_action :verify_authenticity_token

        private

        # Campaign sync and the compendium index are Patreon premium features
        def require_premium!
          refresh_stale_patreon_membership
          return if @user.premium?

          render json: { errors: ['Campaign sync needs a premium Patreon membership.'], code: 'premium_required' },
                 status: :forbidden
        end

        # A lapsed patron may only need a token refresh, so try one (throttled) before deciding
        def refresh_stale_patreon_membership
          PatreonMembership.refresh_if_stale(@user.patreon_account)
        end
      end
    end
  end
end
