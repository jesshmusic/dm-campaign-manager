# frozen_string_literal: true

module Admin
  module V1
    # Lets the signed-in user manage their personal API tokens.
    class ApiTokensController < SecuredController
      before_action :set_user
      before_action :require_user!

      # GET /v1/api-tokens
      def index
        tokens = @user.api_tokens.order(created_at: :desc)
        render json: tokens.map(&:as_json_for_api)
      end

      # POST /v1/api-tokens
      # The plaintext token is only included in this response.
      def create
        token = ApiToken.issue!(user: @user, name: params.require(:api_token).permit(:name)[:name])
        render json: token.as_json_for_api, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      # DELETE /v1/api-tokens/:id
      def destroy
        @user.api_tokens.find(params[:id]).destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { errors: ['API token not found'] }, status: :not_found
      end

      private

      def set_user
        @user = AuthorizationService.new(request.headers).get_current_user
      end

      def require_user!
        render json: { errors: ['Not Authenticated'] }, status: :unauthorized unless @user
      end
    end
  end
end
