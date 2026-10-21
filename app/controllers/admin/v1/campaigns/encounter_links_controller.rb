# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/quests/:quest_id/encounters/:encounter_id/links:
      # an encounter's monsters and NPCs, and its reward items, with how many of each
      class EncounterLinksController < BaseController
        include CampaignLinkActions

        before_action :set_encounter

        private

        def set_encounter
          @link_owner = @campaign.quests.find(params[:quest_id]).encounters.find(params[:encounter_id])
        end
      end
    end
  end
end
