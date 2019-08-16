# frozen_string_literal: true

class HomePolicy < Struct.new(:user, :home)
  def index?
    true
  end
end
