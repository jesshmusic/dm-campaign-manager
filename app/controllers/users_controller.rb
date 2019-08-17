# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update change_role destroy]
  before_action :set_users, only: %i[index]
  before_action :authenticate_user!
  after_action :verify_authorized

  # GET /v1/users
  def index
    authorize User
    @users = if params[:search].present?
               User.search_for(params[:search])
             else
               User.all
             end
    @pagy, @users = pagy(@users.where(role: :dungeon_master).or(@users.where(role: :player))) unless current_user.admin?
    @pagy, @users = pagy(@users) if current_user.admin?

    respond_to do |format|
      format.html { @users }
      format.json { render json: @users, meta: { total: @users.total_entries } }
    end
  end

  # GET /v1/users/{id}
  def show
    authorize @user

    respond_to do |format|
      format.html { @user }
      format.json { render json: @user }
    end
  end

  def edit
    authorize @user
  end

  # PATCH/PUT /users/1
  def update
    authorize @user
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to user_path, notice: 'User was successfully updated.' }
        format.json { render json: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /v1/users/1/change_role
  def change_role
    authorize @user
    if @user.role == 'dungeon_master'
      @user.role = :player
    elsif @user.role == 'player'
      @user.role = :dungeon_master
    end
    respond_to do |format|
      if @user.save
        format.html { redirect_to user_path, notice: 'User role was successfully changed.' }
        format.json { render json: @user }
      else
        format.html { render :index }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  def destroy
    authorize @user
    @user.soft_delete
    respond_to do |format|
      format.html { redirect_to user_path, notice: 'User was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_user
    @user = User.find_by(slug: params[:slug])
  end

  def set_users
    @users = User.all unless params[:search]
    @users = User.search_for(params[:search]) if params[:search]
  end

  def user_params
    params.require(:user).permit(:name, :username, :deleted_at, :role)
  end
end
