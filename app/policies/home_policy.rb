# frozen_string_literal: true

HomePolicy = Struct.new(:user, :home) do
  def index?
    true
  end
end
