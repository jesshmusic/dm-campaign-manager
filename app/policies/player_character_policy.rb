# frozen_string_literal: true

class PlayerCharacterPolicy < CharacterPolicy

  def update?
    user && (user.admin? || (record.user == user))
  end

  def create?
    user
  end
end
