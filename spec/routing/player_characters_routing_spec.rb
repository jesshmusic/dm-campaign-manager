require "rails_helper"

RSpec.describe PlayerCharactersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/player_characters").to route_to("player_characters#index")
    end

    it "routes to #new" do
      expect(:get => "/player_characters/new").to route_to("player_characters#new")
    end

    it "routes to #show" do
      expect(:get => "/player_characters/1").to route_to("player_characters#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/player_characters/1/edit").to route_to("player_characters#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/player_characters").to route_to("player_characters#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/player_characters/1").to route_to("player_characters#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/player_characters/1").to route_to("player_characters#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/player_characters/1").to route_to("player_characters#destroy", :id => "1")
    end
  end
end
