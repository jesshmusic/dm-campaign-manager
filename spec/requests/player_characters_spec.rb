require 'rails_helper'

RSpec.describe "PlayerCharacters", type: :request do
  describe "GET /player_characters" do
    it "works! (now write some real specs)" do
      get player_characters_path
      expect(response).to have_http_status(200)
    end
  end
end
