# frozen_string_literal: true

class PlayerCharacterPolicy < ApplicationPolicy
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
    user
  end

  def generate_npc?
    false
  end

  def create_generated_npc?
    false
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end

  def destroy_all?
    user&.admin?
  end
end
