class DashboardController < ApplicationController
  before_action :authenticate_user!, except: %i[index]

  # GET /index
  def index
    @dms = User.where(role: :dungeon_master)
    @campaigns = Campaign.all
  end
end
