# frozen_string_literal: true

DashboardPolicy = Struct.new(:user, :dashboard) do
  def initialize(user, record)
    raise Pundit::NotAuthorizedError, 'must be logged in' unless user

    @user = user
    @record = record
  end

  def index?
    @user&.admin?
  end

  def update_from_srd?
    @user&.admin?
  end
end
