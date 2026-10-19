# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      class AccountsController < BaseController
        # GET /v1/foundry/me
        # Lets a Foundry module confirm its token works and see what the account can use.
        def show
          refresh_stale_patreon_membership
          render json: {
            user: { name: @user.name, username: @user.username },
            premium: @user.premium?,
            patreon: @user.patreon_account&.as_json_for_account
          }
        end
      end
    end
  end
end
