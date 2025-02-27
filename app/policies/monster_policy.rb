# frozen_string_literal: true

class MonsterPolicy < ApplicationPolicy
  def index?
    true
  end

  def monster_refs?
    true
  end

  def monster_categories?
    true
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
