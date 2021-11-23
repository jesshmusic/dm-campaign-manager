# frozen_string_literal: true

class UsersController < SecuredController
  before_action :set_user
  before_action :set_users, only: %i[index]
  after_action :verify_authorized

  # GET /v1/users
  def index
    authorize @current_user
    @users = if params[:search].present?
               User.search_for(params[:search])
             else
               User.all
             end
    @users = @users.where(role: :dungeon_master) unless @current_user.admin?

    respond_to do |format|
      format.html { @pagy, @users = pagy(@users) }
      format.json
    end
  end

  # POST /users/set_user/
  def set_auth_user
    authorize User
    @user = User.find_or_create_by(auth_id: user_params[:auth_id])
    @user.name = user_params[:name]
    @user.email = user_params[:email]
    @user.username = user_params[:username]
    if user_params[:roles] && user_params[:roles].count > 0
      @user.role = :user if user_params[:roles].include? 'User'
      @user.role = :dungeon_master if user_params[:roles].include? 'Dungeon Master'
      @user.role = :admin if user_params[:roles].include? 'Admin'
    end
    @user.save!
    session[:user] = @user.attributes
    puts session[:user]
  end

  def logout_user
    authorize @current_user unless @current_user.nil?
    cookies.delete('_dungeon_master_screen_online_session')
    session.delete(:user)
    @current_user = nil
    respond_to do |format|
      format.all { head :no_content }
    end
  end

  # GET /v1/users/{id}
  def show
    authorize @current_user unless @current_user.nil?
  end

  # PATCH/PUT /users/1
  def update
    unless @current_user.nil?
    authorize @current_user
    respond_to do |format|
      if @current_user.update(user_params)
        format.html { redirect_to user_path, notice: 'UserProps was successfully updated.' }
        format.json
      else
        format.html { render :edit }
        format.json { render json: @current_user.errors, status: :unprocessable_entity }
      end
    end
    end
  end

  # PATCH/PUT /v1/users/1/change_role
  def change_role
    unless @current_user.nil?
      authorize @current_user
      if @current_user.role == 'dungeon_master'
        @current_user.role = :player
      elsif @current_user.role == 'player'
        @current_user.role = :dungeon_master
      end
      respond_to do |format|
        if @current_user.save
          format.html { redirect_to user_path, notice: 'UserProps role was successfully changed.' }
          format.json
        else
          format.html { render :index }
          format.json { render json: @current_user.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # DELETE /users/1
  # def destroy
  #   unless @current_user.nil?
  #     authorize @current_user
  #     @current_user.soft_delete
  #     respond_to do |format|
  #       format.html { redirect_to user_path, notice: 'UserProps was successfully deleted.' }
  #       format.json { head :no_content }
  #     end
  #   end
  # end

  private

  def set_user
    curr_user = AuthorizationService.new(request.headers).get_current_user
    @user = curr_user
  end

  def set_users
    @users = User.all unless params[:search]
    @users = User.search_for(params[:search]) if params[:search]
  end

  def user_params
    params.require(:user).permit(
      :name, :email, :username, :deleted_at, :role, :auth_id, roles: []
    )
  end
end
