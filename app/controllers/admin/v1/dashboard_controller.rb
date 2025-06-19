# frozen_string_literal: true

require 'dotenv/load'

module Admin::V1
  class DashboardController < SecuredController
    before_action :set_user
    skip_before_action :authorize_request, only: %i[index random_fantasy_name random_tavern_name random_monster_name adventure_hook]

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
      new_name = NameGen.random_name(random_monster_gender, random_monster_race)
      render json: { name: new_name }
    end

    def random_tavern_name
      render json: { name: NameGen.random_tavern_name }
    end

    def random_monster_name
      render json: { name: NameGen.random_monster_name }
    end

    def adventure_hook
      openai = OpenAI::Client.new(api_key: ENV['OPENAI_API_KEY'])

      player_count = params[:player_count].to_i
      average_level = params[:average_level].to_i

      prompt = "Generate a random Dungeons and Dragons 5e adventure hook for #{player_count} players at level #{average_level}."

      completions = openai.completions(prompt)

      render json: { adventure_hook: completions }
    end

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end
  end
end
