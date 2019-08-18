require "rails_helper"

RSpec.describe Admin::V1::MagicItemsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/v1/magic_items").to route_to("magic_items#index")
    end

    it "routes to #new" do
      expect(:get => "/v1/magic_items/new").to route_to("magic_items#new")
    end

    it "routes to #show" do
      expect(:get => "/v1/magic_items/1").to route_to("magic_items#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/v1/magic_items/1/edit").to route_to("magic_items#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/v1/magic_items").to route_to("magic_items#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/v1/magic_items/1").to route_to("magic_items#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/v1/magic_items/1").to route_to("magic_items#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/v1/magic_items/1").to route_to("magic_items#destroy", :id => "1")
    end
  end
end
