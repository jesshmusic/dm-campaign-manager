require 'rails_helper'

RSpec.describe 'Home', type: :request do
  describe 'GET /' do
    context 'when user is not authenticated' do
      it 'returns successful response' do
        get root_path
        expect(response).to have_http_status(:success)
      end

      it 'renders the home layout' do
        get root_path
        expect(response).to render_template(layout: 'home')
      end

      it 'assigns @user as nil' do
        get root_path
        expect(assigns(:user)).to be_nil
      end

      it 'assigns @home_props with model counts' do
        get root_path

        expect(assigns(:home_props)).to have_key(:conditions)
        expect(assigns(:home_props)).to have_key(:dndClasses)
        expect(assigns(:home_props)).to have_key(:items)
        expect(assigns(:home_props)).to have_key(:monsters)
        expect(assigns(:home_props)).to have_key(:races)
        expect(assigns(:home_props)).to have_key(:spells)
        expect(assigns(:home_props)).to have_key(:users)

        expect(assigns(:home_props)[:conditions][:count]).to be >= 0
        expect(assigns(:home_props)[:dndClasses][:count]).to be >= 0
        expect(assigns(:home_props)[:items][:count]).to be >= 0
        expect(assigns(:home_props)[:monsters][:count]).to be >= 0
        expect(assigns(:home_props)[:races][:count]).to be >= 0
        expect(assigns(:home_props)[:spells][:count]).to be >= 0
        expect(assigns(:home_props)[:users][:count]).to be >= 0
      end
    end

    context 'when user is authenticated' do
      let(:user) { create(:user) }

      before do
        allow_any_instance_of(HomeController).to receive(:current_user).and_return(user)
      end

      it 'returns successful response' do
        get root_path
        expect(response).to have_http_status(:success)
      end

      it 'assigns @user with current user JSON' do
        get root_path
        expect(assigns(:user)).to eq(user.as_json)
      end

      it 'includes user in @home_props' do
        get root_path
        expect(assigns(:home_props)[:users][:user]).to eq(user.as_json)
      end
    end
  end

  describe 'GET /app/*' do
    it 'routes to home#index for app paths' do
      get '/app/some/nested/path'
      expect(response).to have_http_status(:success)
      expect(response).to render_template(layout: 'home')
    end
  end
end
