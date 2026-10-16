# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/secrets: the campaign's secrets and clues
      class SecretsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.secrets.order(:position, :created_at)
        end

        def resource_params
          params.require(:secret).permit(%i[text revelation revealed revealed_session_id position])
        end
      end
    end
  end
end
