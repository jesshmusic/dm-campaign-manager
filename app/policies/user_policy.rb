class UserPolicy < ApplicationPolicy
  def edit?
    user.admin? || (user == record)
  end

  def update?
    user.admin? || (user == record)
  end

  def destroy?
    user.admin? || (user == record)
  end

  def change_role?
    user.admin?
  end
end
