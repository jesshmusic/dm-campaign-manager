# frozen_string_literal: true

class AdventurePolicy < ApplicationPolicy
  def update?
    user && (user.admin? || (record.user == user))
  end

  def create?
    user && (user.admin? || user.dungeon_master?)
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end
end
