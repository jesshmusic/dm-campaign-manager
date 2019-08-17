# frozen_string_literal: true

class CampaignPolicy < ApplicationPolicy
  def update?
    user && (user.admin? || record.user == user)
  end

  def create?
    user&.admin? || user&.dungeon_master?
  end

  def destroy?
    user && (user.admin? || record.user == user)
  end

  def confirm_user?
    user&.admin? || (user&.dungeon_master? && record.user == user)
  end

  def join_campaign?
    user
  end
end
