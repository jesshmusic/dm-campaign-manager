require 'rails_helper'

RSpec.describe "Guilds", type: :request do
  describe "GET /guilds" do
    it "works! (now write some real specs)" do
      get guilds_path
      expect(response).to have_http_status(200)
    end
  end
end
