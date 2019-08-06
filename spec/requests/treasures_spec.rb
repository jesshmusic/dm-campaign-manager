require 'rails_helper'

RSpec.describe "Treasures", type: :request do
  describe "GET /treasures" do
    it "works! (now write some real specs)" do
      get treasures_path
      expect(response).to have_http_status(200)
    end
  end
end
