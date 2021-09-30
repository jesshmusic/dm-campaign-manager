# frozen_string_literal: true

module Admin::V1
  class DashboardController < ApplicationController
    before_action :authenticate_user!, except: %i[index random_fantasy_name random_tavern_name]

    # GET /index
    def index
      authorize :dashboard, :index?
      @dms = User.where(role: :dungeon_master)
    end

    def update_from_srd
      authorize :dashboard, :update_from_srd
    end

    def random_fantasy_name
      random_monster_gender = params[:random_monster_gender] || %w[male female].sample
      random_monster_race = params[:random_npc_race] || 'human'
      render json: { name: NameGen.random_name(random_npc_gender, random_npc_race) }
    end

    def random_tavern_name
      render json: { name: NameGen.random_tavern_name }
    end
  end
end
