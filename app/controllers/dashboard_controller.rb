class DashboardController < ApplicationController
  before_action :authenticate_user!, except: %i[index]

  # GET /index
  def index
    # @current_user = current_user
  end
end
