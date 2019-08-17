# frozen_string_literal: true

class NonPlayerCharacterPolicy < CharacterPolicy
  def update?
    user && (user.admin? || (record.user == user))
  end

  def create?
    user && (user.dungeon_master? || user.admin?)
  end
end
