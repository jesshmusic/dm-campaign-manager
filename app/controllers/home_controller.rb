# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
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
      user: current_user.as_json(include: [:player_campaigns ]),
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
      }
    }
  end

  def set_dm_props
    @home_props = {
      user: current_user.as_json(include: [:player_campaigns ]),
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
      }
    }
  end

  def set_player_props
    @home_props = {
      user: current_user.as_json(include: [:player_campaigns ]),
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
      }
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
      playerCharacters: nil,
      dungeonMasters: {
        title: 'Dungeon Masters',
        dungeonMasters: User.where(role: :dungeon_master).limit(5)
      }
    }
  end

  def flash_messages
    flash.map do |type, text|
      { id: text.object_id, type: type, text: text }
    end
  end

  def campaigns(campaigns_list)
    campaigns_list.as_json(include: [:user, :users, :world_locations, :world_events,
                                     adventures: { include: [:encounters] },
                                     characters: { include: [:stat_block, :character_actions, :skills, :spells,
                                                             equipment_items: {
                                                               include: [:items]
                                                             }] }])
  end
end
