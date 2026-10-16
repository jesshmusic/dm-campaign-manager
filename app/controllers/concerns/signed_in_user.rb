# frozen_string_literal: true

# For SecuredController subclasses whose actions all act on the signed-in user.
# Sets @user, or responds 401 when the Auth0 token has no matching user.
module SignedInUser
  extend ActiveSupport::Concern

  included do
    before_action :set_signed_in_user
  end

  private

  def set_signed_in_user
    @user = AuthorizationService.new(request.headers).get_current_user
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized unless @user
  end
end
