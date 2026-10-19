# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Player characters from a Foundry world, sent by Dorman Lakely's
      # Campaign Planner so campaigns can pick their party from them.
      class CharactersController < BaseController
        # POST /v1/foundry/characters
        # Body: { world: { id, title }, characters: [{ uuid, name, playerName, level, sheet }] }
        # Replaces everything from that world.
        def create
          world = params[:world]
          world_id = world.respond_to?(:key?) ? world[:id].to_s : ''
          unless world_id.match?(PlayerCharacter::WORLD_ID_FORMAT)
            return render json: { errors: ['world must have an id'] }, status: :unprocessable_entity
          end

          characters = params[:characters]
          return render json: { errors: ['characters must be a list'] }, status: :unprocessable_entity unless characters.is_a?(Array)

          # The sheet is free-form JSON, stored as is and only ever shown as text
          hashes = characters.map { |character| character.respond_to?(:to_unsafe_h) ? character.to_unsafe_h.to_h : {} }
          title = world[:title].to_s.squish.first(200).presence
          count = PlayerCharacter.replace_world!(@user, world_id, title, hashes)
          render json: { count: count, skipped: characters.size - count }
        end
      end
    end
  end
end
