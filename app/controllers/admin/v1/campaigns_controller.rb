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
      # Optional `template`: blank, three_act, sandbox or five_room
      def create
        template = params[:template].presence || 'blank'
        return render json: { errors: ['Unknown template'] }, status: :unprocessable_entity unless CampaignTemplate::TEMPLATES.include?(template)

        campaign = @user.campaigns.new(campaign_params)
        Campaign.transaction do
          campaign.save!
          CampaignTemplate.apply!(campaign, template)
        end
        render json: campaign.reload.as_full_json_for_api, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      # PATCH /v1/campaigns/:id
      def update
        if @campaign.update(campaign_params)
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

      def campaign_params
        params.require(:campaign).permit(
          :name, :premise, :pitch, :setting_name, :setting_notes, :mode, :status, :planned_sessions, :cadence,
          :party_size, :start_level, :target_level, :tone, truths: []
        )
      end
    end
  end
end
