# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/quests/:quest_id/links: the NPCs a quest
      # involves, and its reward items with how many of each (its monsters
      # are in its encounters)
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
