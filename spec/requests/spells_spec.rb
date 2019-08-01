require 'rails_helper'

RSpec.describe "Spells", type: :request do
  describe "GET /spells" do
    it "works! (now write some real specs)" do
      get spells_path
      expect(response).to have_http_status(200)
    end
  end
end
