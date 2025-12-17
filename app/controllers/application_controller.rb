# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit::Authorization
  include Pagy::Backend

  protect_from_forgery
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  # rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionView::Template::Error, with: :template_error

  # @return [User]
  def current_user
    return if session[:user].nil?

    session_user = session[:user]
    if defined?(@current_user)
      @current_user
    else
      @current_user = User.find_by(auth_id: session_user['auth_id'])
    end
  end

  # Get the current D&D edition from request
  # Priority: query param > header > user preference > default (2024)
  # @return [String] '2014' or '2024'
  def current_edition
    edition = params[:edition] || request.headers['X-DND-Edition']
    return Editionable.normalize_edition(edition) if edition.present?

    current_user&.preferred_edition || Editionable::DEFAULT_EDITION
  end
  helper_method :current_edition

  private

  def user_not_authorized
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'UserProps action not allowed.' }
      format.json do
        render json: {
          errors: 'UserProps action not allowed.'
        }, status: :forbidden
      end
    end
  end

  def not_found
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'Page not found.' }
      format.json do
        render json: {
          errors: 'Page not found.'
        }, status: :not_found
      end
    end
  end

  def template_error(error)
    Rails.logger.debug error
    respond_to do |format|
      format.html { redirect_to root_path, status: :forbidden, notice: 'Template error, please try again later.' }
      format.json do
        render json: {
          errors: error.message
        }, status: :internal_server_error
      end
    end
  end
end
