# frozen_string_literal: true

class ItemPolicy < ApplicationPolicy
  def update?
    user && (user.admin? || (record.user == user))
  end

  def new?
    user&.admin? || user&.dungeon_master?
  end

  def create?
    user&.admin? || user&.dungeon_master?
  end

  def show?
    user&.admin? || (user && record.user == user) || record.user.nil?
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end
end
