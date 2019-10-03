# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Adventures', type: :request do

  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign, user: dungeon_master }
  let!(:adventure1) { create :adventure, campaign: campaign }
  let!(:adventure2) { create :adventure, campaign: campaign }
  let!(:adventure3) { create :adventure, campaign: campaign }

  describe 'GET /adventures' do
    it 'works! (now write some real specs)' do
      get v1_campaign_adventures_path(campaign)
      expect(response).to have_http_status(200)
    end
  end
end
