# frozen_string_literal: true

module Admin::V1
  class ActionsController < SecuredController
    before_action :set_user
    before_action :set_action, only: %i[update destroy]

    # GET /v1/actions
    # GET /v1/actions.json
    def index
      authorize Action
      @actions = Action.where(monster_id: nil)
      render json: { actions: @actions }
    end

    # POST /actions
    # POST /actions.json
    def create
      @action = if action_params[:action_type] == 'attack'
                  MonsterAction.new({ name: action_params[:name], desc: action_params[:desc] })
                else
                  SpecialAbility.new({ name: action_params[:name], desc: action_params[:desc] })
                end
      authorize @action
      respond_to do |format|
        if @action.save
          actions = Action.where(monster_id: nil)
          format.json { render json: { actions: actions }, status: :created }
        else
          format.json { render json: @action.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /actions/:slug
    # PATCH/PUT /actions/:slug.json
    def update
      authorize @action
      @action = Action.find(action_params[:id])
      respond_to do |format|
        if @action.update(monster_params)
          format.json { render @action, status: :ok }
        else
          format.json { render json: @action.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /actions/:slug
    # DELETE /actions/:slug.json
    def destroy
      authorize @action
      @action.destroy

      respond_to do |format|
        actions = Action.where(monster_id: nil)
        format.json { render json: { actions: actions }, status: :created }
      end
    end

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end

    # Use callbacks to share common setup or constraints between api.
    def set_action
      @action = Action.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.

    def action_params
      params.require(:custom_action).permit(
        :id, :desc, :name, :action_type, :monster_id
      )
    end
  end
end
