# frozen_string_literal: true

json.extract! @user, :id, :name, :email, :username, :role, :location, :info, :auth_id, :sign_in_count
json.redirect_path @redirect_path
