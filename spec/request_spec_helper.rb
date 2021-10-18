module RequestSpecHelper

  include Warden::Test::Helpers

  def self.included(base)
    base.before(:each) { Warden.test_mode! }
    base.after(:each) { Warden.test_reset! }
  end

  def login_player
    user = FactoryBot.create(:player_user)
    # sign_in user
  end

  def login_dungeon_master
    user = FactoryBot.create(:dungeon_master_user)
    # sign_in user
  end

  def login_admin
    user = FactoryBot.create(:admin_user)
    # sign_in user
  end

  def sign_in(resource)
    login_as(resource, scope: warden_scope(resource))
  end

  def sign_out(resource)
    logout(warden_scope(resource))
  end

  private

  def warden_scope(resource)
    resource.class.name.underscore.to_sym
  end

end
