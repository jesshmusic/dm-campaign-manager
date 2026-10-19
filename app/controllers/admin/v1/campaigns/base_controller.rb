# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # Base for resources nested under one of the signed-in DM's campaigns.
      # Another user's campaign responds 404, as if it did not exist.
      class BaseController < SecuredController
        include SignedInUser

        before_action :set_campaign

        rescue_from ActiveRecord::RecordNotFound do
          render json: { errors: ['Not found'] }, status: :not_found
        end

        private

        def set_campaign
          @campaign = @user.campaigns.friendly.find(params[:campaign_id])
        end
      end
    end
  end
end
