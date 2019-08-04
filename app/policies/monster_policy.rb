class MonsterPolicy < ApplicationPolicy
  def show?
    return true
  end
  
  def edit?
    user.admin? or record.user == user
  end

  def update?
    user.admin? or record.user == user
  end

  def create?
    user.admin? or user.dungeon_master?
  end

  def destroy?
    user.admin? or record.user == user
  end

  def destroy_all?
    user.admin?
  end
end
