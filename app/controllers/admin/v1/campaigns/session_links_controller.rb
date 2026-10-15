# frozen_string_literal: true

module Admin
  module V1
    module Campaigns
      # /v1/campaigns/:campaign_id/sessions/:session_id/links: what the DM
      # preps for a session (secrets, locations, NPCs, quests, fronts,
      # monsters and items)
      class SessionLinksController < BaseController
        before_action :set_planner_session

        # POST /v1/campaigns/:campaign_id/sessions/:session_id/links
        def create
          link_params = params.require(:link).permit(:linkable_type, :linkable_id)
          unless CampaignSessionLink::LINKABLE_TYPES.include?(link_params[:linkable_type])
            return render json: { errors: ['Unknown link type'] }, status: :unprocessable_entity
          end

          link = @planner_session.links.new(link_params.merge(position: next_position))
          if link.save
            render json: link.as_json_for_api, status: :created
          else
            render json: { errors: link.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /v1/campaigns/:campaign_id/sessions/:session_id/links/:id
        def destroy
          @planner_session.links.find(params[:id]).destroy!
          head :no_content
        end

        private

        # Not @session: that name belongs to the Rails session
        def set_planner_session
          @planner_session = @campaign.sessions.find(params[:session_id])
        end

        def next_position
          (@planner_session.links.maximum(:position) || -1) + 1
        end
      end
    end
  end
end
