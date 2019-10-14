# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit
  include Pagy::Backend
  protect_from_forgery
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  # @return [User]
  def current_user
    super
  end

  private

  def user_not_authorized
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'User action not allowed.' }
      format.json {
        render json: {
          errors: 'User action not allowed.'
        }, status: :forbidden
      }
    end
  end

  def not_found
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'Page not found.' }
      format.json {
        render json: {
          errors: 'Page not found.'
        }, status: :not_found
      }
    end
  end
end
