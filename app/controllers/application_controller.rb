class ApplicationController < ActionController::Base
  include Pundit
  include Pagy::Backend
  protect_from_forgery

  # @return [User]
  def current_user
    super
  end
end
