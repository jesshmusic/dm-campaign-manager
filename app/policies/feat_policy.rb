# frozen_string_literal: true

class FeatPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    # Only DM and Admin can create homebrew feats
    user && (user.admin? || user.dungeon_master?)
  end

  def update?
    return false unless user

    # Admin can update anything
    return true if user.admin?

    # DM can only update their own homebrew feats
    return false unless record.homebrew?

    user.dungeon_master? && record.user == user
  end

  def destroy?
    return false unless user

    # Admin can delete anything
    return true if user.admin?

    # DM can only delete their own homebrew feats
    return false unless record.homebrew?

    user.dungeon_master? && record.user == user
  end
end
