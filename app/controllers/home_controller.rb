# frozen_string_literal: true

class HomeController < ApplicationController
  layout "home"

  def index
    @home_props = { user: current_user }
  end
end
