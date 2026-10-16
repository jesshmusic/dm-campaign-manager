# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/locations: the campaign's fantastic locations
      class LocationsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.locations.order(:name)
        end

        def resource_params
          params.require(:location).permit([:name, :description, :notes, :parent_id, :foundry_map_id, :foundry_scene_uuid,
                                            :foundry_scene_name, { features: [] }])
        end
      end
    end
  end
end
