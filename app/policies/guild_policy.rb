# frozen_string_literal: true

class GuildPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user&.dungeon_master? || user&.admin?
  end

  def update?
    user&.dungeon_master? || user&.admin?
  end

  def new?
    user&.dungeon_master? || user&.admin?
  end

  def create?
    user&.dungeon_master? || user&.admin?
  end

  def destroy?
    user&.dungeon_master? || user&.admin?
  end

  def generate_npc?
    create_generated_npc?
  end

  def create_generated_npc?
    user&.dungeon_master? || user&.admin?
  end

  def random_fantasy_name?
    true
  end
end
