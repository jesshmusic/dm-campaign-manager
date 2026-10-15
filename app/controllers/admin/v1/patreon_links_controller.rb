# frozen_string_literal: true

module Admin
  module V1
    # Links a Patreon account to the signed-in DM Guru user. The OAuth
    # redirect lands on PatreonAuthController#callback.
    class PatreonLinksController < SecuredController
      before_action :set_user
      before_action :require_user!

      # GET /v1/patreon/link
      def show
        render json: link_status
      end

      # POST /v1/patreon/link
      def create
        client_id = ENV.fetch('PATREON_CLIENT_ID', nil)
        redirect_uri = ENV.fetch('PATREON_REDIRECT_URI', nil)
        return render json: { errors: ['Patreon is not configured'] }, status: :service_unavailable if client_id.blank? || redirect_uri.blank?

        query = {
          response_type: 'code',
          client_id: client_id,
          redirect_uri: redirect_uri,
          state: PatreonLinkState.generate(@user),
          scope: 'identity identity.memberships'
        }.map { |key, value| "#{key}=#{ERB::Util.url_encode(value)}" }.join('&')

        render json: { url: "https://www.patreon.com/oauth2/authorize?#{query}" }
      end

      # DELETE /v1/patreon/link
      def destroy
        @user.patreon_account&.destroy
        head :no_content
      end

      private

      def set_user
        @user = AuthorizationService.new(request.headers).get_current_user
      end

      def require_user!
        render json: { errors: ['Not Authenticated'] }, status: :unauthorized unless @user
      end

      def link_status
        account = @user.patreon_account
        {
          linked: account.present?,
          premium: @user.premium?,
          account: account&.as_json_for_account
        }
      end
    end
  end
end
