# frozen_string_literal: true

module Admin
  module V1
    # The signed-in DM's campaigns. Campaigns are private to their owner.
    class CampaignsController < SecuredController
      include SignedInUser

      before_action :set_campaign, only: %i[show update destroy]

      rescue_from ActiveRecord::RecordNotFound do
        render json: { errors: ['Campaign not found'] }, status: :not_found
      end

      # GET /v1/campaigns
      def index
        campaigns = @user.campaigns.includes(:sessions, :fronts).order(updated_at: :desc)
        render json: campaigns.map(&:as_summary_json_for_api)
      end

      # GET /v1/campaigns/:id
      def show
        render json: @campaign.as_full_json_for_api
      end

      # POST /v1/campaigns
      # Optional `template`: blank, three_act, sandbox or five_room, and
      # `campaign[party_character_ids]`: the DM's player characters in the party
      def create
        campaign = CampaignCreator.new(@user).create!(campaign_params, template: params[:template], party_ids: party_ids)
        render json: campaign.reload.as_full_json_for_api, status: :created
      rescue CampaignCreator::UnknownTemplate
        render json: { errors: ['Unknown template'] }, status: :unprocessable_entity
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      # PATCH /v1/campaigns/:id
      def update
        saved = Campaign.transaction do
          @campaign.update(campaign_params).tap { |ok| @campaign.assign_party!(party_ids) if ok && party_ids }
        end
        if saved
          render json: @campaign.as_json_for_api
        else
          render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /v1/campaigns/:id
      def destroy
        @campaign.destroy!
        head :no_content
      end

      private

      def set_campaign
        @campaign = @user.campaigns.friendly.find(params[:id])
      end

      # The party's player character ids, when the request sets them
      def party_ids
        campaign = params[:campaign]
        return unless campaign.respond_to?(:key?) && campaign.key?(:party_character_ids)

        Array(campaign[:party_character_ids]).map(&:to_s)
      end

      def campaign_params
        params.require(:campaign).permit(*CampaignCreator::ATTRIBUTES)
      end
    end
  end
end
