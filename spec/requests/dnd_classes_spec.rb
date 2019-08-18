require 'rails_helper'

RSpec.describe "DndClasses", type: :request do
  describe "GET /dnd_classes" do
    it "works! (now write some real specs)" do
      get v1_dnd_classes_path
      expect(response).to have_http_status(200)
    end
  end
end
