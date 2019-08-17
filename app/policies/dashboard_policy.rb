# frozen_string_literal: true

class DashboardPolicy < Struct.new(:user, :dashboard)
  def initialize(user, record)
    raise Pundit::NotAuthorizedError, 'must be logged in' unless user

    @user = user
    @record = record
  end

  def index?
    @user&.admin?
  end
end
