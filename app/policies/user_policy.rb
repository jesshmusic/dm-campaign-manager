# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def set_auth_user?
    true
  end

  def show?
    user.admin? || (user == record)
  end

  def create?
    # user.admin? || (user == record)
    true
  end

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
