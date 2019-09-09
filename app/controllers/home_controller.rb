# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    @user = current_user ? current_user.as_json(include: [:campaigns]) : nil
    pcsCount = 0
    npcsCount = 0
    if @user
      Campaign.where(user: current_user).each do |campaign|
        pcsCount += campaign.characters.where(type: 'PlayerCharacter').count
        npcsCount += campaign.characters.where(type: 'NonPlayerCharacter').count
      end
    end
    @home_props = {
      user: @user,
      campaignsCount: @user ? Campaign.where(user: current_user).count : Campaign.all.count,
      pcsCount: @user ? pcsCount : PlayerCharacter.all.count,
      npcsCount: @user ? npcsCount : NonPlayerCharacter.all.count,
      monstersCount: Monster.all.count,
      itemsCount: Item.all.count,
      spellsCount: Spell.all.count,
      usersCount: User.all.count
    }
  end
end
