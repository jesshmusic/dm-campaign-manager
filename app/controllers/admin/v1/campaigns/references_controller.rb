# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/references: pointers into the 2024 core books
      class ReferencesController < BaseController
        include CampaignChildResource

        private

        def resource_scope
          @campaign.book_references.order(:book, :name)
        end

        def resource_params
          params.require(:reference).permit(%i[name book category page challenge_rating foundry_uuid notes])
        end
      end
    end
  end
end
