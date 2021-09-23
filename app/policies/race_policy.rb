# frozen_string_literal: true

class RacePolicy < ApplicationPolicy
  def index?
    true
  end

  def new?
    # user && (user.admin? || user.dungeon_master?)
    false
  end

  def edit?
    # user && (user.admin? || user.dungeon_master?)
    false
  end

  def show?
    user&.admin? || (user && record.user == user) || record.user.nil?
  end

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
