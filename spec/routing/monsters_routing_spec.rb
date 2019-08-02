require "rails_helper"

RSpec.describe MonstersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/monsters").to route_to("monsters#index")
    end

    it "routes to #new" do
      expect(:get => "/monsters/new").to route_to("monsters#new")
    end

    it "routes to #show" do
      expect(:get => "/monsters/1").to route_to("monsters#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/monsters/1/edit").to route_to("monsters#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/monsters").to route_to("monsters#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/monsters/1").to route_to("monsters#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/monsters/1").to route_to("monsters#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/monsters/1").to route_to("monsters#destroy", :id => "1")
    end
  end
end
