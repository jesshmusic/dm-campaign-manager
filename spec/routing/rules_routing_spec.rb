require "rails_helper"

RSpec.describe Admin::V1::RulesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/v1/rules").to route_to("admin/v1/rules#index")
    end

    it "routes to #new" do
      expect(get: "/v1/rules/new").to route_to("admin/v1/rules#new")
    end

    it "routes to #show" do
      expect(get: "/v1/rules/1").to route_to("admin/v1/rules#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/v1/rules/1/edit").to route_to("admin/v1/rules#edit", id: "1")
    end

    it "routes to #create" do
      expect(post: "/v1/rules").to route_to("admin/v1/rules#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/v1/rules/1").to route_to("admin/v1/rules#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/v1/rules/1").to route_to("admin/v1/rules#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/v1/rules/1").to route_to("admin/v1/rules#destroy", id: "1")
    end
  end
end
