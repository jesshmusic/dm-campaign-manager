module Admin
  module V1
    class FoundryMapTagsController < ApplicationController
      before_action :set_tag, only: %i[update destroy]

      # GET /v1/map-tags
      def index
        tags = FoundryMapTag.ordered.all
        render json: tags.map { |tag|
          {
            id: tag.id.to_s,
            name: tag.name,
            slug: tag.slug,
            mapCount: tag.foundry_maps.count
          }
        }
      end

      # POST /v1/map-tags
      def create
        tag = FoundryMapTag.new(tag_params)

        if tag.save
          render json: {
            id: tag.id.to_s,
            name: tag.name,
            slug: tag.slug,
            mapCount: 0
          }, status: :created
        else
          render json: { error: tag.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /v1/map-tags/:id
      def update
        if @tag.update(tag_params)
          render json: {
            id: @tag.id.to_s,
            name: @tag.name,
            slug: @tag.slug,
            mapCount: @tag.foundry_maps.count
          }
        else
          render json: { error: @tag.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      end

      # DELETE /v1/map-tags/:id
      def destroy
        @tag.destroy
        head :no_content
      end

      private

      def set_tag
        @tag = FoundryMapTag.find(params[:id])
      end

      def tag_params
        params.require(:foundry_map_tag).permit(:name)
      end
    end
  end
end
