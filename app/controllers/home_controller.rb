# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    @user = current_user ? current_user.as_json(include: [:campaigns]) : nil
    @home_props = {
      user: @user
    }
  end
end
