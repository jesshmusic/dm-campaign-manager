# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit
  include Pagy::Backend
  protect_from_forgery
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionView::Template::Error, with: :template_error

  # @return [User]
  def current_user
    super
  end

  private

  def user_not_authorized
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'IUser action not allowed.' }
      format.json {
        render json: {
          errors: 'IUser action not allowed.'
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

  def template_error(error)
    puts error
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'Template error, please try again later.' }
      format.json {
        render json: {
          errors: error.message
        }, status: :internal_server_error
      }
    end
  end
end
