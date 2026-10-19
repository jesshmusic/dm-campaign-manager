# frozen_string_literal: true

# Authenticates requests with a personal API token (`Authorization: Bearer dmg_...`)
# instead of an Auth0 session. Sets @api_token and @user.
module ApiTokenAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_token!
  end

  private

  def authenticate_api_token!
    scheme, plaintext = request.authorization.to_s.split(' ', 2)
    @api_token = ApiToken.authenticate(plaintext) if scheme == 'Bearer'
    @user = @api_token&.user
    render json: { errors: ['Invalid API token'] }, status: :unauthorized unless @user
  end
end
