# frozen_string_literal: true

require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.
#
# Also compared to earlier versions of this generator, there are no longer any
# expectations of assigns and templates rendered. These features have been
# removed from Rails core in Rails 5, but can be added back in via the
# `rails-controller-testing` gem.

RSpec.describe Admin::V1::AdventuresController, type: :controller do
  # This should return the minimal set of attributes required to create a valid
  # Adventure. As you add validations to Adventure, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) do
    attributes_for(:adventure)
  end

  let(:invalid_attributes) do
    skip('Add a hash of attributes invalid for your model')
  end

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # AdventuresController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign_with_assoc, user: dungeon_master }
  let!(:campaign_unowned) { create :campaign_with_assoc }
  let!(:world_location) { create :world_location, campaign: campaign }

  describe 'GET #index' do
    it 'returns a success response' do
      sign_in dungeon_master
      get :index, params: { campaign_slug: campaign.slug }
      expect(response).to be_successful
    end

    it 'returns 5 adventures' do
      sign_in dungeon_master
      get :index, params: { campaign_slug: campaign.slug }
      expect(assigns(:adventures).count).to eq 5
    end


    it 'does NOT return a success response' do
      sign_in dungeon_master
      get :index, params: { campaign_slug: campaign_unowned.slug }
      expect(response).not_to be_successful
    end
  end

  describe 'GET #show' do
    it 'returns a success response' do
      sign_in dungeon_master
      adventure_id = campaign.adventures.first.id
      get :show,
          params: {
            campaign_slug: campaign.slug,
            id: adventure_id
          },
          format: :json
      expect(response).to be_successful
    end

    it 'returns the first adventure' do
      sign_in dungeon_master
      adventure_id = campaign.adventures.first.id
      get :show,
          params: {
            campaign_slug: campaign.slug,
            id: adventure_id
          },
          format: :json
      expect(assigns(:adventure)).to eq(campaign.adventures.first)
    end


    it 'does NOT return a success response' do
      sign_in dungeon_master
      adventure_id = campaign_unowned.adventures.first.id
      get :show,
          params: {
            campaign_slug: campaign_unowned.slug,
            id: adventure_id
          },
          format: :json
      expect(response).not_to be_successful
    end
  end

  describe 'GET #new' do
    it 'returns a success response' do
      sign_in dungeon_master
      get :new, params: { campaign_slug: campaign.slug }
      expect(response).to be_successful
    end

    it 'does NOT return a success response' do
      sign_in dungeon_master
      get :new, params: { campaign_slug: campaign_unowned.slug }
      expect(response).not_to be_successful
    end
  end

  describe 'GET #edit' do
    it "returns a success response for ADMIN only" do
      sign_in admin
      adventure_id = campaign.adventures.first.id
      get :edit, params: {
        campaign_slug: campaign.slug,
        id: adventure_id
      }
      expect(response).to be_successful
    end

    it "does not return a success response for non-ADMIN users" do
      sign_in dungeon_master
      adventure_id = campaign.adventures.first.id
      get :edit, params: {
        campaign_slug: campaign.slug,
        id: adventure_id
      }
      expect(response).not_to be_successful
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Adventure' do
        sign_in dungeon_master
        expect do
          post :create, params: { campaign_slug: campaign.slug, adventure: valid_attributes }
        end.to change(Adventure, :count).by(1)
      end

      it 'does NOT create a new Adventure' do
        sign_in dungeon_master
        expect do
          post :create, params: { campaign_slug: campaign_unowned.slug, adventure: valid_attributes }
        end.to change(Adventure, :count).by(0)
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid params' do
      it 'updates the requested adventure' do
        sign_in dungeon_master
        adventure_id = campaign.adventures.first.id
        put :update, params: {
          campaign_slug: campaign.slug,
          id: adventure_id,
          adventure: {name: 'New Adventure Name'}, }
        campaign.reload
        expect(campaign.adventures.first.name).to eq('New Adventure Name')
      end

      it 'does NOT update the requested adventure' do
        sign_in dungeon_master
        adventure_id = campaign_unowned.adventures.first.id
        put :update, params: {
          campaign_slug: campaign_unowned.slug,
          id: adventure_id,
          adventure: {name: 'New Adventure Name'}, }
        campaign_unowned.reload
        expect(campaign_unowned.adventures.first.name).not_to eq('New Adventure Name')
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested adventure' do
      sign_in dungeon_master
      adventure_id = campaign.adventures.first.id
      expect do
        delete :destroy, params: {
          campaign_slug: campaign.slug,
          id: adventure_id,
        }
      end.to change(Adventure, :count).by(-1)
    end

    it 'does NOT destroy the requested adventure' do
      sign_in dungeon_master
      adventure_id = campaign_unowned.adventures.first.id
      expect do
        delete :destroy, params: {
          campaign_slug: campaign_unowned.slug,
          id: adventure_id,
        }
      end.to change(Adventure, :count).by(0)
    end
  end
end
