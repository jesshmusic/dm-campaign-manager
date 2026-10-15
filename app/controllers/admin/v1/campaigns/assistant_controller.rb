# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # AI help for a campaign. Uses the DM's own OpenAI key, or the hosted key
      # for premium members. Proposals are returned for review; only `apply`
      # saves anything.
      class AssistantController < BaseController
        REQUESTS_PER_HOUR = 30

        before_action :enforce_rate_limit, except: :apply

        rescue_from OpenAIClient::Error do |error|
          Rails.logger.error("Campaign assistant OpenAI error: #{error.message}")
          render json: { errors: ["The AI service failed: #{error.message}"] }, status: :bad_gateway
        end
        # Declared after its parent class: handlers are searched from the bottom up
        rescue_from OpenAIClient::NoKeyError do |error|
          render json: { errors: [error.message], code: 'no_ai_key' }, status: :forbidden
        end
        rescue_from CampaignAssistant::Error do |error|
          render json: { errors: [error.message] }, status: :unprocessable_entity
        end

        # POST /v1/campaigns/:campaign_id/assistant/outline
        def outline
          render json: CampaignAssistant.new(@campaign).outline
        end

        # POST /v1/campaigns/:campaign_id/assistant/apply
        # Body: { outline: {...}, sections: [...] }
        def apply
          outline = params.require(:outline)
          unless outline.is_a?(ActionController::Parameters)
            return render json: { errors: ['Outline must be an object'] }, status: :unprocessable_entity
          end

          sections = Array(params[:sections]).map(&:to_s)
          campaign = CampaignOutlineApplier.apply!(@campaign, outline, sections: sections)
          render json: campaign.as_full_json_for_api
        rescue ActiveRecord::RecordInvalid => e
          render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end

        # POST /v1/campaigns/:campaign_id/sessions/:session_id/assistant/prep
        # Body: { step: strong_start | scenes | secrets | locations }
        def prep
          render json: CampaignAssistant.new(@campaign).prep(planner_session, params[:step].to_s)
        end

        # POST /v1/campaigns/:campaign_id/sessions/:session_id/assistant/recap
        def recap
          render json: CampaignAssistant.new(@campaign).recap(planner_session)
        end

        private

        def planner_session
          @campaign.sessions.find(params[:session_id])
        end

        # Each AI call costs money, whoever's key it uses
        def enforce_rate_limit
          key = "campaign-assistant/#{@user.id}/#{Time.current.strftime('%Y%m%d%H')}"
          count = Rails.cache.increment(key, 1, expires_in: 1.hour) || 0
          return if count <= REQUESTS_PER_HOUR

          render json: { errors: ['Too many AI requests this hour. Please try again later.'] }, status: :too_many_requests
        end
      end
    end
  end
end
