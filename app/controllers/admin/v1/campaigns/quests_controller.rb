# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/quests: the campaign's main and side quests
      class QuestsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.quests.order(:kind, :act, :position, :created_at)
        end

        def resource_params
          params.require(:quest).permit(%i[name kind status description reward notes act position level_min level_max parent_id
                                           giver_npc_id location_id])
        end
      end
    end
  end
end
