# frozen_string_literal: true

class AdventurePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def update?
    user&.dungeon_master? || user&.admin?
  end

  def new?
    user&.dungeon_master? || user&.admin?
  end

  def create?
    user&.dungeon_master? || user&.admin?
  end

  def destroy?
    user&.dungeon_master? || user&.admin?
  end
end
