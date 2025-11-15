require 'rails_helper'

RSpec.describe "Admin::V1::Proficiencies", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/v1/proficiencies", headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      prof = Prof.create!(name: 'Test Prof', prof_type: 'Skills')
      get "/v1/proficiencies/#{prof.id}", headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:success)
    end
  end

end
