require 'rails_helper'

RSpec.describe "Admin::V1::Proficiencies", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/admin/v1/proficiencies/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/admin/v1/proficiencies/show"
      expect(response).to have_http_status(:success)
    end
  end

end
