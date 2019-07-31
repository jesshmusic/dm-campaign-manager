class CampaignPolicy < ApplicationPolicy

  def show?
    user && user.admin? || user.dungeon_master? || user.player?
  end

  def edit?
    user && user.admin? || user.dungeon_master?
  end

  def update?
    user && user.admin? || user.dungeon_master?
  end

  def create?
    user && user.admin? || user.dungeon_master?
  end

  def destroy?
    user && user.admin? || user.dungeon_master?
  end

  def destroy_all?
    user && user.admin?
  end
end
