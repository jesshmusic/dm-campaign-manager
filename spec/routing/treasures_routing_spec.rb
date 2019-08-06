require "rails_helper"

RSpec.describe TreasuresController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/treasures").to route_to("treasures#index")
    end

    it "routes to #new" do
      expect(:get => "/treasures/new").to route_to("treasures#new")
    end

    it "routes to #show" do
      expect(:get => "/treasures/1").to route_to("treasures#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/treasures/1/edit").to route_to("treasures#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/treasures").to route_to("treasures#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/treasures/1").to route_to("treasures#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/treasures/1").to route_to("treasures#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/treasures/1").to route_to("treasures#destroy", :id => "1")
    end
  end
end
