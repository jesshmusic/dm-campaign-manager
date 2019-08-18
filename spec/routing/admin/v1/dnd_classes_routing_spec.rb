require "rails_helper"

RSpec.describe Admin::V1::DndClassesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/v1/dnd_classes").to route_to("dnd_classes#index")
    end

    it "routes to #new" do
      expect(:get => "/v1/dnd_classes/new").to route_to("dnd_classes#new")
    end

    it "routes to #show" do
      expect(:get => "/v1/dnd_classes/1").to route_to("dnd_classes#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/v1/dnd_classes/1/edit").to route_to("dnd_classes#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/v1/dnd_classes").to route_to("dnd_classes#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/v1/dnd_classes/1").to route_to("dnd_classes#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/v1/dnd_classes/1").to route_to("dnd_classes#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/v1/dnd_classes/1").to route_to("dnd_classes#destroy", :id => "1")
    end
  end
end
