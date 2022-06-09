# frozen_string_literal: true

module Admin::V1
  class DashboardController < SecuredController
    before_action :set_user
    skip_before_action :authorize_request, only: %i[index random_fantasy_name random_tavern_name random_monster_name]

    # GET /index
    def index
      authorize :dashboard, :index?
      @dms = User.where(role: :dungeon_master)
    end

    def custom_actions
      actions = Action.where(monster_id: nil)
      render json: { actions: actions }
    end

    def create_action
      authorize @user
      @action = if action_params[:action_type] == 'attack'
                  MonsterAction.new({ name: action_params[:name], desc: action_params[:desc] })
                else
                  SpecialAbility.new({ name: action_params[:name], desc: action_params[:desc] })
                end
      respond_to do |format|
        if @action.save
          actions = Action.where(monster_id: nil)
          format.json { render json: { actions: actions }, status: :created }
        else
          format.json { render json: @action.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    def update_action
      authorize @user
      @action = Action.find(action_params[:id])
      respond_to do |format|
        if @action.update(monster_params)
          format.json { render :show, status: :ok }
        else
          format.json { render json: @action.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
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

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end

    def action_params
      params.require(:dashboard).require(:action).permit(
        :id, :desc, :name, :action_type, :monster_id
      )
    end
  end
end
