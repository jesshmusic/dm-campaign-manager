class CampaignPolicy < ApplicationPolicy

  def show?
    return true
  end

  def edit?
    user and (user.admin? or record.user == user)
  end

  def update?
    user and (user.admin? or record.user == user)
  end
  
  def confirm_user?
    user and user.dungeon_master? and record.user == user
  end
  
  def join_campaign?
    user
  end

  def create?
    user and (user.admin? or user.dungeon_master?)
  end

  def destroy?
    user and (user.admin? or record.user == user)
  end

  def destroy_all?
    user and user.admin?
  end
end
