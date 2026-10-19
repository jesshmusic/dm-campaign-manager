# frozen_string_literal: true

module Admin
  module V1
    # Lets the signed-in DM approve or deny a Foundry module's device link
    # (see DeviceLink), from the website's /link page.
    class DeviceLinksController < SecuredController
      include SignedInUser

      before_action :set_device_link

      # GET /v1/device-links/:user_code
      def show
        render json: @device_link.as_json_for_approval
      end

      # POST /v1/device-links/:user_code/approve
      def approve
        if @user.api_tokens.count >= ApiToken::MAX_PER_USER
          return render json: {
            errors: ["You can have at most #{ApiToken::MAX_PER_USER} API tokens. Revoke one on your dashboard, then try again."]
          }, status: :unprocessable_entity
        end

        @device_link.approve!(@user) ? head(:no_content) : render_not_found
      end

      # POST /v1/device-links/:user_code/deny
      def deny
        @device_link.deny! ? head(:no_content) : render_not_found
      end

      private

      def set_device_link
        @device_link = DeviceLink.find_pending_by_user_code(params[:user_code])
        render_not_found unless @device_link
      end

      def render_not_found
        render json: { errors: ['That code is not valid, or it has expired.'] }, status: :not_found
      end
    end
  end
end
