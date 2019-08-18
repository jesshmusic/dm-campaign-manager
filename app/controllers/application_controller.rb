# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit
  include Pagy::Backend
  protect_from_forgery

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def user_not_authorized
    flash[:alert] = 'You are not authorized to perform this action.'
    redirect_to(request.referrer || root_path)
  end

  # @return [User]
  def current_user
    super
  end
end
