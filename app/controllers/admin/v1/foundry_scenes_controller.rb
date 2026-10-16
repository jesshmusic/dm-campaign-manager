# frozen_string_literal: true

module Admin
  module V1
    # The signed-in DM's Foundry scenes (see FoundryScene), with their
    # thumbnails, for picking the maps of places, sessions and quests
    class FoundryScenesController < SecuredController
      include SignedInUser

      # GET /v1/foundry_scenes
      def index
        scenes = @user.foundry_scenes.order(:world_title, :world_id, :name, :id).to_a
        render json: { count: scenes.size, results: scenes.map(&:as_summary_json_for_api) }
      end
    end
  end
end
