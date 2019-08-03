require "rails_helper"

RSpec.describe DndClassesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/dnd_classes").to route_to("dnd_classes#index")
    end

    it "routes to #new" do
      expect(:get => "/dnd_classes/new").to route_to("dnd_classes#new")
    end

    it "routes to #show" do
      expect(:get => "/dnd_classes/1").to route_to("dnd_classes#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/dnd_classes/1/edit").to route_to("dnd_classes#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/dnd_classes").to route_to("dnd_classes#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/dnd_classes/1").to route_to("dnd_classes#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/dnd_classes/1").to route_to("dnd_classes#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/dnd_classes/1").to route_to("dnd_classes#destroy", :id => "1")
    end
  end
end
