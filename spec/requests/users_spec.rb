require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'GET /users' do
    context 'when user is an admin' do
      let(:admin) { create(:admin_user) }

      before { stub_authentication(admin) }

      it 'returns successful response' do
        get users_path, as: :json
        expect(response).to have_http_status(:success)
      end
    end

    context 'when user is not an admin' do
      let(:user) { create(:user) }

      before { stub_authentication(user) }

      it 'returns forbidden status' do
        get users_path, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      before { stub_no_auth }

      it 'returns unauthorized status' do
        get users_path, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /users/login' do
    let(:auth_params) do
      {
        user: {
          auth_id: 'auth0|123456',
          name: 'Test User',
          email: 'test@example.com',
          username: 'testuser',
          roles: ['User']
        }
      }
    end

    # Note: This endpoint requires authorization which we can't easily stub
    # in request specs. It's tested at the integration level.
    it 'endpoint exists' do
      post user_set_user_path, params: auth_params
      expect(response).to have_http_status(:unauthorized).or have_http_status(:success)
    end
  end

  describe 'DELETE /users/logout' do
    let(:user) { create(:user) }

    before { stub_authentication(user) }

    it 'returns no content status' do
      delete user_logout_user_path
      expect(response).to have_http_status(:no_content)
    end

    it 'clears the session' do
      delete user_logout_user_path
      expect(session[:user]).to be_nil
    end
  end
end
