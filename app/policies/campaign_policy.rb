class CampaignPolicy < ApplicationPolicy

  def show?
    user.admin? or user.dungeon_master? or user.player?
  end

  def edit?
    user.admin? or user.dungeon_master?
  end

  def update?
    user.admin? or user.dungeon_master?
  end

  def create?
    user.admin? or user.dungeon_master?
  end

  def destroy?
    user.admin? or user.dungeon_master?
  end

  def destroy_all?
    user.admin?
  end
end
