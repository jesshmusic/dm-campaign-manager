# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/quests/:quest_id/encounters: a quest's
      # encounters (fights, talks, puzzles and traps), in order
      class EncountersController < BaseController
        include CampaignChildResource

        private

        def quest
          @quest ||= @campaign.quests.find(params[:quest_id])
        end

        # New encounters get the campaign and the quest from the scope
        def resource_scope
          @campaign.encounters.where(quest_id: quest.id).includes(links: :linkable).order(:position, :id)
        end

        def resource_params
          params.require(:encounter).permit(
            :name, :kind, :description, :notes, :position, :reward_xp,
            reward_currency: MapsAndCoins::COINS, foundry_scenes: %i[uuid name]
          )
        end
      end
    end
  end
end
