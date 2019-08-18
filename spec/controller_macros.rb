module ControllerMacros

  def login_user
    before(:each) do
      @request.env['devise.mapping'] = Devise.mappings[:player_user]
      user = FactoryBot.create(:player_user)
      sign_in user
    end
  end

  def login_dungeon_master
    before(:each) do
      @request.env['devise.mapping'] = Devise.mappings[:dungeon_master]
      user = FactoryBot.create(:dungeon_master_user)
      sign_in user
    end
  end

  def login_admin
    before(:each) do
      @request.env['devise.mapping'] = Devise.mappings[:admin_user]
      user = FactoryBot.create(:admin_user)
      sign_in user
    end
  end
end
