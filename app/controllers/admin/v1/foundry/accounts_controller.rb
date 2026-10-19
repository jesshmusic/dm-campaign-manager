# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      class AccountsController < BaseController
        # GET /v1/foundry/me
        # Lets a Foundry module confirm its token works and see whose account it is.
        def show
          render json: { user: { name: @user.name, username: @user.username } }
        end
      end
    end
  end
end
