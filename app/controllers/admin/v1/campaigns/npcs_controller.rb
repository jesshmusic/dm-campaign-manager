# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/npcs: the campaign's cast (NPCs and villains)
      class NpcsController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.npcs.includes(:monster).order(:name)
        end

        def resource_params
          params.require(:npc).permit(%i[name role description motive secret appearance voice notes monster_id faction_id
                                         stat_block_reference_id])
        end
      end
    end
  end
end
