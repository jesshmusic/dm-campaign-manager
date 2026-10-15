module Admin
  module V1
    class FoundryMapsAdminController < ApplicationController
      # The standalone admin page moved into the React app, where requests
      # carry the Auth0 token the admin endpoints now require.
      def index
        redirect_to '/app/admin-dashboard/foundry-maps'
      end
    end
  end
end
