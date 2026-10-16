# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Thumbnails of the scenes in a DM's Foundry worlds, sent by Dorman
      # Lakely's Campaign Planner so the DM can pick them as maps on the
      # website, and they show while Foundry is closed.
      class ScenesController < BaseController
        # The body has its own `scene` key, so don't wrap it in one
        wrap_parameters false

        before_action :require_premium!
        before_action :set_world_id

        # GET /v1/foundry/scenes?world=<world id>
        # What the module has sent from that world: { scenes: { [uuid]: { name, version, thumbnailUrl } } }
        def index
          scenes = @user.foundry_scenes.where(world_id: @world_id)
          render json: { scenes: scenes.to_h { |scene| [scene.foundry_uuid, scene.as_json_for_api.slice(:name, :version, :thumbnailUrl)] } }
        end

        # POST /v1/foundry/scenes
        # Body: { world: { id, title }, scene: { uuid, name, version, thumbnail } }, the thumbnail a data URL
        def create
          scene = params[:scene]
          unless scene.respond_to?(:key?)
            return render json: { errors: ['scene must have a uuid, name, version and thumbnail'] }, status: :unprocessable_entity
          end

          world = { id: @world_id, title: params.dig(:world, :title).to_s.squish.first(200).presence }
          saved = FoundryScene.save_from_world!(
            @user, world,
            { uuid: scene[:uuid].to_s, name: scene[:name].to_s.squish.first(200), version: scene[:version].to_s,
              thumbnail: scene[:thumbnail].to_s }
          )
          render json: saved.as_json_for_api
        rescue FoundryScene::InvalidThumbnail => e
          render json: { errors: [e.message] }, status: :unprocessable_entity
        rescue ActiveRecord::RecordInvalid => e
          render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        rescue Aws::Errors::ServiceError, Seahorse::Client::NetworkingError => e
          Rails.logger.error "Scene thumbnail upload failed: #{e.message}"
          render json: { errors: ['Could not save the thumbnail. Try again later.'] }, status: :bad_gateway
        end

        # DELETE /v1/foundry/scenes?world=<world id>&uuid=<Scene.xxx>
        # For a scene deleted in Foundry, or one that no longer has a map image
        def destroy
          scene = @user.foundry_scenes.find_by(world_id: @world_id, foundry_uuid: params[:uuid].to_s)
          return render json: { errors: ['Scene not found'] }, status: :not_found unless scene

          scene.destroy!
          head :no_content
        end

        private

        # A world id, from ?world=<id> or { world: { id } }
        def set_world_id
          world = params[:world]
          @world_id = (world.respond_to?(:key?) ? world[:id] : world).to_s
          return if @world_id.match?(PlayerCharacter::WORLD_ID_FORMAT)

          render json: { errors: ['world must have an id'] }, status: :unprocessable_entity
        end
      end
    end
  end
end
