# frozen_string_literal: true

module Admin::V1
  class DashboardController < SecuredController
    skip_before_action :authorize_request, only: %i[index random_fantasy_name random_tavern_name, random_monster_name]

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
      random_monster_race = params[:random_monster_race] || 'human'
      render json: { name: NameGen.random_name(random_monster_gender, random_monster_race) }
    end

    def random_tavern_name
      render json: { name: NameGen.random_tavern_name }
    end

    def random_monster_name
      render json: { name: NameGen.random_monster_name }
    end
  end
end
