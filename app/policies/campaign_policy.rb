# frozen_string_literal: true

class CampaignPolicy < ApplicationPolicy
  def index?
    user&.admin? || user&.dungeon_master?
  end

  def show?
    user && (user.admin? || record.user == user)
  end

  def update?
    user && (user.admin? || record.user == user)
  end

  def new?
    user && (user.admin? || (record.user == user))
  end

  def create?
    user&.admin? || user&.dungeon_master?
  end

  def destroy?
    user && (user.admin? || record.user == user)
  end

  def generate_npc?
    create_generated_npc?
  end

  def create_generated_npc?
    user&.dungeon_master? || user&.admin?
  end

  def confirm_user?
    user&.admin? || (user&.dungeon_master? && record.user == user)
  end

  def join_campaign?
    user
  end
end
