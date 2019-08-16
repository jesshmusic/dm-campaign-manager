# frozen_string_literal: true

class SpellPolicy < ApplicationPolicy
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
