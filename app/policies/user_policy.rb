class UserPolicy < ApplicationPolicy

  def index?
    user != nil
  end

  def show?
    user != nil
  end

  def edit?
    user.admin? or user == record
  end

  def update?
    user.admin? or user == record
  end

  def destroy?
    user.admin? or user == record
  end

  def change_role?
    user.admin?
  end
end
