# frozen_string_literal: true

module Admin
  module V1
    # The words of the new-campaign setup guide (see SetupGuide). Anyone can
    # read them, including the Foundry module; only an admin changes them.
    class SetupGuidesController < ApplicationController
      include AdminApiAuthorization

      wrap_parameters false
      before_action :require_admin!, only: :update

      # GET /v1/setup_guide
      def show
        expires_in 5.minutes, public: true
        render json: SetupGuide.as_json_for_api
      end

      # PATCH /v1/setup_guide
      # { steps: [{ id, label, title, intro, why, example }], templates: [{ value, title, description, example }] }
      def update
        guide = SetupGuide.new
        if guide.update(steps: entries(:steps), templates: entries(:templates))
          render json: SetupGuide.as_json_for_api
        else
          render json: { errors: guide.errors }, status: :unprocessable_entity
        end
      end

      private

      def guide_params
        params.permit(steps: %w[id] + SetupGuide::STEP_WORDS, templates: %w[value] + SetupGuide::TEMPLATE_WORDS)
      end

      def entries(collection)
        Array(guide_params[collection]).map(&:to_h)
      end
    end
  end
end
