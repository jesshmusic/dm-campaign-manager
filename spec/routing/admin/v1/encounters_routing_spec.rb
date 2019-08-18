require "rails_helper"

RSpec.describe Admin::V1::EncountersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/v1/encounters").to route_to("encounters#index")
    end

    it "routes to #new" do
      expect(:get => "/v1/encounters/new").to route_to("encounters#new")
    end

    it "routes to #show" do
      expect(:get => "/v1/encounters/1").to route_to("encounters#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/v1/encounters/1/edit").to route_to("encounters#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/v1/encounters").to route_to("encounters#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/v1/encounters/1").to route_to("encounters#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/v1/encounters/1").to route_to("encounters#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/v1/encounters/1").to route_to("encounters#destroy", :id => "1")
    end
  end
end
