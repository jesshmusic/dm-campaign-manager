require 'rails_helper'

RSpec.describe "MagicItems", type: :request do
  describe "GET /magic_items" do
    it "works! (now write some real specs)" do
      get v1_magic_items_path
      expect(response).to have_http_status(200)
    end
  end
end
