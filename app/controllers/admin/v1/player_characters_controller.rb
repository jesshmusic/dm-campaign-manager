# frozen_string_literal: true

module Admin
  module V1
    # The signed-in DM's player characters from Foundry (see PlayerCharacter),
    # for choosing a campaign's party
    class PlayerCharactersController < SecuredController
      include SignedInUser

      # GET /v1/player-characters
      def index
        characters = @user.player_characters.order(:world_title, :world_id, :name)
        render json: characters.map(&:as_summary_json_for_api)
      end
    end
  end
end
