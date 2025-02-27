require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:valid_attributes) {
    attributes_for(:user, name: 'Test Testperson', email: 'testperson@example.com')
  }

  describe 'GET Return all Users' do
    context 'for Logged Out Users' do
      it 'returns an error response' do
        get '/users.json'
        result_users = JSON.parse(response.body)
        expect(result_users['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'returns 3 users' do
        get '/users.json'
        result_users = JSON.parse(response.body)
        expect(result_users.count).to eq(5)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'returns error for logged out user trying to get the users list' do
        get '/users.json'
        result_users = JSON.parse(response.body)
        expect(result_users['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'GET Return single UserProps' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user creating user' do
        get "/users/#{dungeon_master.id}"
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'returns a success response and renders show template' do
        get "/users/#{dungeon_master.id}"
        expect(response).to have_http_status(200)
        expect(response).to render_template('show')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end
      it 'returns a success response and renders show template' do
        get "/users/#{dungeon_master.id}"
        expect(response).to have_http_status(200)
        expect(response).to render_template('show')
      end

      it 'returns error for another user' do
        get "/users/#{other_user.id}"
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'GET UserProps back end Edit Page (admin only)' do
    context 'for Logged Out Users' do
      it 'returns a redirect response' do
        get "/users/#{dungeon_master.id}/edit"
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'returns a success and renders the edit template' do
        get "/users/#{dungeon_master.id}/edit"
        expect(response).to have_http_status(200)
        expect(response).to render_template('edit')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'returns a success response and renders the edit template' do
        get "/users/#{dungeon_master.id}/edit"
        expect(response).to have_http_status(200)
        expect(response).to render_template('edit')
      end
    end
  end

  describe 'PUT Update UserProps' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user editing' do
        put "/users/#{dungeon_master.id}", params: {
          user: {
            name: 'Test UserProps Edited'
          }
        }
        expect(response).to have_http_status(302)
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'updates the requested user belonging to DM' do
        put "/users/#{dungeon_master.id}", params: {
          user: {
            name: 'Test UserProps Edited'
          }
        }
        expect(response).to have_http_status(302)
        dungeon_master.reload
        expect(dungeon_master.name).to eq('Test UserProps Edited')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'updates the requested user belonging to DM' do
        put "/users/#{dungeon_master.id}", params: {
          user: {
            name: 'Test UserProps Edited'
          }
        }
        expect(response).to have_http_status(302)
        dungeon_master.reload
        expect(dungeon_master.name).to eq('Test UserProps Edited')
      end

      it 'returns an error for non-admin editing default user' do
        put "/users/#{other_user.id}", params: {
          user: {
            name: 'Test UserProps Edited'
          }
        }
        expect(response).to have_http_status(403)
      end

    end
  end

  describe 'DELETE Delete UserProps' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user delete' do
        delete "/users/#{other_user.id}"
        expect(other_user.deleted_at).to be_nil
        expect(User.all.count).to eq(5)
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'deletes the requested user belonging to DM' do
        delete "/users/#{dungeon_master.id}"
        dungeon_master.reload
        expect(dungeon_master.deleted_at).not_to be_nil
        expect(User.all.count).to eq(5)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'deletes the requested user belonging to DM' do
        delete "/users/#{dungeon_master.id}"
        dungeon_master.reload
        expect(dungeon_master.deleted_at).not_to be_nil
        expect(User.all.count).to eq(5)
      end

      it 'returns an error for non-admin deleting a different user' do
        delete "/users/#{other_user.id}"
        other_user.reload
        expect(other_user.deleted_at).to be_nil
        expect(User.all.count).to eq(5)
      end
    end
  end
end
