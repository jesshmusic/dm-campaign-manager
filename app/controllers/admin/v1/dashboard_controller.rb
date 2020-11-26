# frozen_string_literal: true

module Admin::V1
  class DashboardController < ApplicationController
    before_action :authenticate_user!, except: %i[index]

    # GET /index
    def index
      authorize :dashboard, :index?
      @dms = User.where(role: :dungeon_master)
    end
  end
end
