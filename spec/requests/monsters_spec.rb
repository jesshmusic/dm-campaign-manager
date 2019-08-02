require 'rails_helper'

RSpec.describe "Monsters", type: :request do
  describe "GET /monsters" do
    it "works! (now write some real specs)" do
      get monsters_path
      expect(response).to have_http_status(200)
    end
  end
end
