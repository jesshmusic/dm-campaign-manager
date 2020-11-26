# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    @user = current_user ? current_user.as_json(include: [:campaigns]) : nil
    @home_props = {
      user: @user,
      npcsCount: Monster.all.count,
      itemsCount: Item.all.count,
      spellsCount: Spell.all.count,
      usersCount: User.all.count
    }
  end
end
