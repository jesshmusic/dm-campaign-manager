# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/sessions/:session_id/links: what the DM
      # preps for a session (secrets, locations, NPCs, quests, fronts,
      # monsters and items), and how many of each treasure
      class SessionLinksController < BaseController
        include CampaignLinkActions

        before_action :set_planner_session

        private

        # Not @session: that name belongs to the Rails session
        def set_planner_session
          @link_owner = @campaign.sessions.find(params[:session_id])
        end
      end
    end
  end
end
