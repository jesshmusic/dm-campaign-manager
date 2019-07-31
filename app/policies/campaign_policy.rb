class CampaignPolicy < ApplicationPolicy

  def show?
    return true
  end

  def edit?
    user.admin? || user.moderator?
  end

  def update?
    user && user.admin?
  end

  def create?
    user && user.admin?
  end

  def destroy?
    user && user.admin?
  end

  def destroy_all?
    user && user.admin?
  end
end
