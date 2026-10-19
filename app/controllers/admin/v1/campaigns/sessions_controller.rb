# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/sessions: the campaign's game sessions
      class SessionsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.sessions.includes(links: :linkable).order(:number)
        end

        def resource_params
          params.require(:session).permit(
            :number, :title, :scheduled_on, :status, :level, :character_notes, :strong_start, :treasure, :log, :recap,
            scenes: [], treasure_currency: MapsAndCoins::COINS, foundry_scenes: %i[uuid name]
          )
        end
      end
    end
  end
end
