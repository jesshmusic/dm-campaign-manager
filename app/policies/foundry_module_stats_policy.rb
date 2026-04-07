# frozen_string_literal: true

class FoundryModuleStatsPolicy < ApplicationPolicy
  def index?
    user&.admin?
  end
end
