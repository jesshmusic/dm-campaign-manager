class DashboardController < ApplicationController
  before_action :authenticate_user!

  # GET /index
  def index
    # @current_user = current_user
  end
end
