# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    @user = current_user ? current_user.as_json(include: [:campaigns]) : nil
    @home_props = {
      user: @user,
      campaignsCount: @user ? Campaign.where(user: current_user).count : Campaign.all.count,
      pcsCount: @user ? PlayerCharacter.where(user: current_user).count : PlayerCharacter.all.count,
      npcsCount: @user ? NonPlayerCharacter.where(user: current_user).count : NonPlayerCharacter.all.count,
      monstersCount: Monster.all.count,
      itemsCount: Item.all.count,
      spellsCount: Spell.all.count,
      usersCount: User.all.count
    }
  end
end
