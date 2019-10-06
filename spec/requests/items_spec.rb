require 'rails_helper'

RSpec.describe "Items", type: :request do

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }

  let(:gear_item_attributes) {
    attributes_for(:item, user: dungeon_master, name: 'New Gear Item')
  }

  let(:armor_item_attributes) {
    attributes_for(:item, user: dungeon_master, name: 'New Half Plate')
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

    it "returns 1 armor item" do
      get '/v1/armor_items.json'
      result_items = JSON.parse(response.body)
      expect(result_items.count).to be >= 1
      expect(result_items.first['type']).to eq('ArmorItem')
    end

    it "returns 1 magic item" do
      get '/v1/magic_items.json'
      result_items = JSON.parse(response.body)
      expect(result_items.count).to eq(1)
      expect(result_items.first['type']).to eq('MagicItem')
    end
  end

  describe "GET /v1/items/:slug" do
    it "returns a success response" do
      get "/v1/armor_items/#{armor_item.slug}.json"
      expect(response).to have_http_status(200)
    end

    it "returns Plate Armor" do
      get "/v1/armor_items/#{armor_item.slug}.json"
      result_item = JSON.parse(response.body)
      expect(result_item['name']).to eq('Plate Armor')
      expect(result_item['type']).to eq('ArmorItem')
    end
  end

  describe "GET /v1/items/:slug/edit" do
    it "returns a success response" do
      sign_in admin
      get "/v1/armor_items/#{armor_item.slug}/edit"
      expect(response).to have_http_status(200)
    end

    it "returns a forbidden response" do
      sign_in dungeon_master
      get "/v1/armor_items/#{armor_item.slug}/edit"
      expect(response).to have_http_status(403)
    end
  end

  describe "POST /v1/items/" do
    context "with valid params belonging to DM" do
      it "creates a new GearItem" do
        sign_in dungeon_master
        expect {
          post '/v1/gear_items.json', params: {gear_item: gear_item_attributes}
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Gear Item')
        expect(result_item['type']).to eq('GearItem')
      end

      it "creates a new ArmorItem" do
        sign_in dungeon_master
        expect {
          post '/v1/armor_items.json', params: {armor_item: armor_item_attributes}
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Half Plate')
        expect(result_item['type']).to eq('ArmorItem')
      end

      it "returns an error for non-user creating item" do
        expect {
          post '/v1/armor_items.json', params: {armor_item: armor_item_attributes}
        }.to change(Item, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end
  end

  describe "PUT /v1/items/:slug" do
    context "with valid params" do
      it "updates the requested item belonging to DM" do
        sign_in dungeon_master
        armor_item.user = dungeon_master
        armor_item.save!
        put "/v1/armor_items/#{armor_item.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited',
            armor_class: 19,
            armor_class_bonus: 2
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Item Edited')
        expect(result_item['type']).to eq('ArmorItem')
        expect(result_item['armorClass']).to eq(19)
        expect(result_item['armorClassBonus']).to eq(2)
      end

      it "returns an error for non-user editing" do
        put "/v1/armor_items/#{armor_item.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited',
            armor_class: 19,
            armor_class_bonus: 2
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end

      it "returns an error for non-admin editing" do
        sign_in dungeon_master
        put "/v1/armor_items/#{armor_item.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited',
            armor_class: 19,
            armor_class_bonus: 2
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end

  describe "DELETE /v1/items/:slug" do
    context "with valid params" do
      it "deletes the requested item belonging to DM" do
        sign_in dungeon_master
        armor_item.user = dungeon_master
        armor_item.save!
        delete "/v1/armor_items/#{armor_item.slug}.json"
        expect(response).to have_http_status(204)
      end

      it "returns an error for non-user delete" do
        delete "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end

      it "returns an error for non-admin editing" do
        sign_in dungeon_master
        delete "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('User action not allowed.')
      end
    end
  end
end
