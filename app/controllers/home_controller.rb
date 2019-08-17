# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    puts flash.to_json
    authorize :home, :index?
    if current_user&.dungeon_master?
      set_dm_props
    elsif current_user
      set_player_props
    else
      set_logged_out_props
    end
  end

  private

  def set_dm_props
    @home_props = {
      user: current_user,
      campaigns: {
        title: 'My Campaigns',
        campaigns: current_user.campaigns
      },
      characters: {
        title: 'My Characters',
        characters: Character.where(user_id: current_user.id)
      },
      dungeonMasters: {
        title: 'My Dungeon Masters',
        dungeonMasters: current_user.campaigns.map(&:dungeon_master)
      },
      flashMessages: flash_messages
    }
  end

  def set_player_props
    @home_props = {
      user: current_user,
      campaigns: {
        title: 'My Campaigns',
        campaigns: current_user.player_campaigns
      },
      characters: {
        title: 'My Characters',
        characters: Character.where(user_id: current_user.id)
      },
      dungeonMasters: {
        title: 'My Dungeon Masters',
        dungeonMasters: current_user.player_campaigns.map(&:dungeon_master)
      },
      flashMessages: flash_messages
    }
  end

  def set_logged_out_props
    @home_props = {
      user: nil,
      campaigns: {
        title: 'Campaigns',
        campaigns: Campaign.all.limit(5)
      },
      characters: {
        title: 'Characters',
        characters: Character.all.limit(5)
      },
      dungeonMasters: {
        title: 'Dungeon Masters',
        dungeonMasters: User.where(role: :dungeon_master).limit(5)
      },
      flashMessages: flash_messages
    }
  end

  def flash_messages
    flash.map do |type, text|
      { id: text.object_id, type: type, text: text }
    end
  end
end
