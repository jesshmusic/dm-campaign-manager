# frozen_string_literal: true

class SessionsController < Devise::SessionsController

  def new
    super
  end

  # POST /v1/login
  def create
    @user = User.find_by_email(user_params[:email])
    return invalid_login_attempt unless @user

    if @user.valid_password?(user_params[:password])
      sign_in :user, @user
      respond_to do |format|
        format.html { redirect_to '/', notice: "User #{@user.name} logged in." }
        format.json { render json: @user, include: [:campaigns] }
      end
    else
      invalid_login_attempt
    end
  end

  def destroy
    sign_out(@user)
    respond_to do |format|
      format.html { redirect_to '/', notice: "User successfully logged out." }
      format.json { render json: { success: true } }
    end
  end


  private

  def invalid_login_attempt
    warden.custom_failure!
    render json: { error: 'invalid login attempt' }, status: :unprocessable_entity
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end

end