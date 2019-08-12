# frozen_string_literal: true

class CharacterPolicy < ApplicationPolicy
  def show?
    true
  end

  def edit?
    user && (user.admin? || (record.user == user))
  end

  def update?
    user && (user.admin? || (record.user == user))
  end

  def create?
    user && (user.campaign_users.where(confirmed: true).count > 0 || user.dungeon_master? || user.admin?)
  end

  def generate_npc?
    create_generated_npc?
  end

  def create_generated_npc?
    user || user.dungeon_master?
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end

  def destroy_all?
    user&.admin?
  end
end
