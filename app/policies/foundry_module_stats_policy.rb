# frozen_string_literal: true

FoundryModuleStatsPolicy = Struct.new(:user, :foundry_module_stats) do
  def initialize(user, record)
    raise Pundit::NotAuthorizedError, 'must be logged in' unless user

    @user = user
    @record = record
  end

  def index?
    @user&.admin?
  end
end
