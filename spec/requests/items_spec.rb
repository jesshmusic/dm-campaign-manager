require 'rails_helper'

RSpec.describe "Items", type: :request do

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }

  let(:valid_attributes) {
    attributes_for(:item, user: dungeon_master)
  }

  let!(:item) { create :item }
  let!(:armor_item) { create :item,
                             name: 'Plate Armor',
                             type: 'ArmorItem',
                             armor_class: 14,
                             armor_class_bonus: 0 }
  let!(:weapon_item) { create :item,
                              name: 'Longsword',
                              type: 'WeaponItem',
                              weapon_attack_bonus: 0,
                              weapon_damage_bonus: 0,
                              weapon_damage_dice_count: 1,
                              weapon_damage_dice_value: 8,
                              weapon_damage_type: 'bludgeoning' }
  let!(:gear_item) { create :item, type: 'GearItem' }
  let!(:magic_item) { create :item, type: 'MagicItem', rarity: 'uncommon' }

  describe "GET /v1/items" do
    it "returns a success response" do
      get '/v1/items.json'
      expect(response).to have_http_status(200)
    end

    it "returns 5 items" do
      get '/v1/items.json'
      result_items = JSON.parse(response.body)
      expect(result_items.count).to eq(5)
    end
  end

  describe "GET /v1/items/:slug" do
    it "returns a success response" do
      get "/v1/items/#{armor_item.slug}.json"
      expect(response).to have_http_status(200)
    end

    it "returns Plate Armor" do
      get "/v1/items/#{armor_item.slug}.json"
      result_item = JSON.parse(response.body)
      expect(result_item['name']).to eq('Plate Armor')
    end
  end

  describe "POST /v1/items/" do
    context "with valid params belonging to DM" do
      it "creates a new ArmorItem" do
        sign_in dungeon_master
        expect {
          post '/v1/items.json', params: {item: { name: "New Armor" }}
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Armor')
      end
    end
  end
end
