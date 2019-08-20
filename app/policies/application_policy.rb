# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    raise Pundit::NotAuthorizedError, 'must be logged in' unless user

    @user = user
    @record = record
  end

  def index?
    true
  end

  def show?
    @user&.admin?
  end

  def create?
    false
  end

  def new?
    @user&.admin?
  end

  def update?
    false
  end

  def edit?
    @user&.admin?
  end

  def destroy?
    false
  end

  def destroy_all?
    @user&.admin?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      raise Pundit::NotAuthorizedError, 'must be logged in' unless user

      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
