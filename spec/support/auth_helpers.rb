module AuthHelpers
  def stub_authentication(user = nil)
    auth_service = instance_double(AuthorizationService)
    allow(AuthorizationService).to receive(:new).and_return(auth_service)

    if user
      allow(auth_service).to receive(:authenticate_request!).and_return(true)
      allow(auth_service).to receive(:get_current_user).and_return(user)
      # Stub current_user for Pundit authorization
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
    else
      allow(auth_service).to receive(:authenticate_request!).and_raise(JWT::DecodeError)
      allow(auth_service).to receive(:get_current_user).and_return(nil)
      # Stub current_user for Pundit authorization
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(nil)
    end
  end

  def stub_admin_auth
    admin = create(:admin_user)
    stub_authentication(admin)
    admin
  end

  def stub_dungeon_master_auth
    dm = create(:dungeon_master_user)
    stub_authentication(dm)
    dm
  end

  def stub_no_auth
    stub_authentication(nil)
  end
end
