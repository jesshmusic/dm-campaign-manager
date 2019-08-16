# frozen_string_literal: true

class CharacterPolicy < ApplicationPolicy

  def update?
    user&.admin
  end

  def create?
    user_has_campaigns = user.campaign_users.where(confirmed: true).count.positive?
    (user && user_has_campaigns) || user&.dungeon_master? || user&.admin?
  end

  def generate_npc?
    create_generated_npc?
  end

  def create_generated_npc?
    user&.dungeon_master? || user&.admin?
  end

  def destroy?
    user && (user.admin? || (record.user == user))
  end
end
