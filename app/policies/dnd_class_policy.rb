# frozen_string_literal: true

class DndClassPolicy < ApplicationPolicy
  def show?
    user && (user.admin? || (record.user.nil? && user.dungeon_master?) || (record.user == user && user.dungeon_master?))
  end

  def edit?
    user && (user.admin? || (record.user == user))
  end

  def update?
    user && (user.admin? || (record.user == user))
  end

  def new?
    user && (user.admin? || user.dungeon_master?)
  end

  def create?
    user && (user.admin? || user.dungeon_master?)
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end
end
