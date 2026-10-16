# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/quests/:quest_id/links: the NPCs a quest
      # involves, the monsters for its encounters, and its reward items with
      # how many of each
      class QuestLinksController < BaseController
        include CampaignLinkActions

        before_action :set_quest

        private

        def set_quest
          @link_owner = @campaign.quests.find(params[:quest_id])
        end
      end
    end
  end
end
