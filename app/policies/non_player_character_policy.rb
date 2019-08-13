# frozen_string_literal: true

class NonPlayerCharacterPolicy < ApplicationPolicy
  def show?
    true
  end

  def edit?
    user && (user.admin? || (record.user == user))
  end

  def update?
    user && (user.admin? || user.dungeon_master? || (record.user == user))
  end

  def create?
    user && (user.dungeon_master? || user.admin?)
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
