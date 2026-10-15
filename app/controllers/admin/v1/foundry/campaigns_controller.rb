# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Campaign sync for Dorman Lakely's Campaign Planner (Patreon premium).
      class CampaignsController < BaseController
        UUID_FORMAT = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/

        before_action :require_premium!
        before_action :set_campaign, except: :index

        # GET /v1/foundry/campaigns
        def index
          campaigns = @user.campaigns.order(updated_at: :desc)
          render json: campaigns.map { |campaign|
            { uuid: campaign.uuid, name: campaign.name, slug: campaign.slug, mode: campaign.mode,
              status: campaign.status, syncVersion: campaign.sync_counter }
          }
        end

        # GET /v1/foundry/campaigns/:uuid/changes?since=N
        def changes
          render json: CampaignSync.new(@campaign).changes_since(params[:since].to_i.clamp(0, nil))
        end

        # POST /v1/foundry/campaigns/:uuid/changes
        # Body: { changes: [{ type, uuid, baseVersion, attributes: {...} }] }
        def push
          changes = params.require(:changes)
          return render json: { errors: ['changes must be a list'] }, status: :unprocessable_entity unless changes.is_a?(Array)

          render json: CampaignSync.new(@campaign).apply(changes.map { |change| change.permit!.to_h })
        end

        private

        def require_premium!
          return if @user.premium?

          render json: { errors: ['Campaign sync needs a premium Patreon membership.'], code: 'premium_required' },
                 status: :forbidden
        end

        def set_campaign
          uuid = params[:uuid].to_s
          @campaign = @user.campaigns.find_by(uuid: uuid) if uuid.match?(UUID_FORMAT)
          render json: { errors: ['Campaign not found'] }, status: :not_found unless @campaign
        end
      end
    end
  end
end
