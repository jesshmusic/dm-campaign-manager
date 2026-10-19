# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/factions: the campaign's factions
      class FactionsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.factions.order(:name)
        end

        def resource_params
          params.require(:faction).permit(%i[name description goal notes])
        end
      end
    end
  end
end
