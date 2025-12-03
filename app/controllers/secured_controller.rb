class SecuredController < ApplicationController
  before_action :authorize_request

  private

  def authorize_request
    auth_header = request.headers['Authorization']
    Rails.logger.info "Authorization header present: #{auth_header.present?}"
    Rails.logger.info "Authorization header: #{auth_header&.truncate(50)}" if auth_header.present?
    AuthorizationService.new(request.headers).authenticate_request!
  rescue JWT::VerificationError, JWT::DecodeError => e
    Rails.logger.error "JWT Error: #{e.class} - #{e.message}"
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized
  end
end
