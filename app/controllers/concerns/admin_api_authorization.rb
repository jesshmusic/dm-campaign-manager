# frozen_string_literal: true

# Requires a valid Auth0 JWT that belongs to an admin user.
#
# For controllers that mix public endpoints (called by Foundry modules) with
# admin-only endpoints, so they can't inherit SecuredController wholesale.
module AdminApiAuthorization
  extend ActiveSupport::Concern

  private

  def require_admin!
    auth = AuthorizationService.new(request.headers)
    auth.authenticate_request!
    @user = auth.get_current_user
    return if @user&.admin?

    render json: { errors: ['Admin access required'] }, status: :forbidden
  rescue JWT::VerificationError, JWT::DecodeError
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized
  end
end
