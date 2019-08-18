require "rails_helper"

RSpec.describe Admin::V1::SpellsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/v1/spells").to route_to("spells#index")
    end

    it "routes to #new" do
      expect(:get => "/v1/spells/new").to route_to("spells#new")
    end

    it "routes to #show" do
      expect(:get => "/v1/spells/1").to route_to("spells#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/v1/spells/1/edit").to route_to("spells#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/v1/spells").to route_to("spells#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/v1/spells/1").to route_to("spells#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/v1/spells/1").to route_to("spells#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/v1/spells/1").to route_to("spells#destroy", :id => "1")
    end
  end
end
