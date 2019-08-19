# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    puts flash.to_json
    authorize :home, :index?
    if current_user&.admin?
      set_admin_props
    elsif current_user&.dungeon_master?
      set_dm_props
    elsif current_user
      set_player_props
    else
      set_logged_out_props
    end
  end



  private

  def set_admin_props
    @home_props = {
      user: current_user,
      campaigns: {
        title: 'My Campaigns',
        campaigns: campaigns(current_user.campaigns)
      },
      nonPlayerCharacters: {
        title: 'My Non-player Characters',
        characters: NonPlayerCharacter.where(user: current_user)
      },
      playerCharacters: {
        title: 'My Player Characters',
        characters: PlayerCharacter.where(user: current_user)
      },
      dungeonMasters: {
        title: 'My Dungeon Masters',
        dungeonMasters: current_user.campaigns.map(&:dungeon_master)
      },
      flashMessages: flash_messages
    }
  end

  def set_dm_props
    @home_props = {
      user: current_user,
      campaigns: {
        title: 'My Campaigns',
        campaigns: campaigns(current_user.campaigns)
      },
      nonPlayerCharacters: {
        title: 'My Non-player Characters',
        characters: NonPlayerCharacter.where(user: current_user)
      },
      playerCharacters: {
        title: 'My Player Characters',
        characters: PlayerCharacter.where(user: current_user)
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
        campaigns: campaigns(current_user.campaigns)
      },
      nonPlayerCharacters: nil,
      playerCharacters: {
        title: 'My Player Characters',
        characters: PlayerCharacter.where(user: current_user)
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
        campaigns: campaigns(Campaign.all.limit(5))
      },
      nonPlayerCharacters: nil,
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

  def campaigns(campaigns_list)
    puts campaigns_list.as_json
    campaigns_list.as_json(include: [
      :users, :world_locations, :world_events,
      adventures: {include: [:encounters] }
    ], methods: %i[pcs npcs])
  end
end
