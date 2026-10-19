# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/fronts: the campaign's fronts (threats with progress clocks)
      class FrontsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.fronts.order(:created_at)
        end

        def resource_params
          params.require(:front).permit([:name, :description, :goal, :doom, :clock_segments, :clock_filled, :npc_id, :faction_id,
                                         { stakes: [], portents: %i[text triggered] }])
        end
      end
    end
  end
end
