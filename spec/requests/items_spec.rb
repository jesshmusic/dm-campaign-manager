require 'rails_helper'

RSpec.describe 'Items', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  let(:gear_item_attributes) {
    attributes_for(:item, user: dungeon_master, name: 'New Gear Item')
  }

  let(:armor_item_attributes) {
    attributes_for(:item, user: dungeon_master, name: 'New Half Plate')
  }

  let!(:item) { create :item }
  let!(:armor_item) { create :armor_item,
                             name: 'Plate Armor' }
  let!(:weapon_item) { create :item,
                              name: 'Longsword',
                              type: 'WeaponItem' }
  let!(:gear_item) { create :item, type: 'GearItem' }
  let!(:magic_item) { create :item, type: 'MagicItem', rarity: 'uncommon' }
  let!(:item_custom1) { create :item, user: dungeon_master, name: 'DM Item' }
  let!(:item_custom2) { create :item, user: other_user, name: 'Other UserProps Item' }

  describe 'GET Return all Items' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get '/v1/items.json'
        expect(response).to have_http_status(200)
      end

      it 'returns 5 items' do
        get '/v1/items.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(788)
      end

      it 'returns 1 armor item' do
        get '/v1/armor_items.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to be >= 1
        expect(result_items['results'].first['type']).to eq('ArmorItem')
      end

      it 'returns 1 magic item' do
        get '/v1/magic_items.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to be >= 1
        expect(result_items['results'].first['type']).to eq('MagicItem')
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'returns 7 items' do
        get '/v1/items.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(790)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'returns 6 items that are only default or owned by this DM' do
        get '/v1/items.json'
        result_items = JSON.parse(response.body)
        expect(result_items['count']).to eq(789)
        expect(result_items['results'].find { |item|
          item['name'] == 'DM Item'
        }).not_to be_nil
        expect(result_items['results'].find { |item|
          item['name'] == 'Other UserProps Item'
        }).to be_nil
      end
    end

  end

  describe 'GET Return single Item' do
    context 'for Logged Out Users' do
      it 'returns a success response' do
        get "/v1/armor_items/#{armor_item.slug}.json"
        expect(response).to have_http_status(200)
      end

      it 'returns Plate Armor' do
        get "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Plate Armor')
        expect(result_item['type']).to eq('ArmorItem')
      end

      it 'returns error for logged out user trying to get custom item' do
        get "/v1/items/#{item_custom1.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'returns Plate Armor' do
        get "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Plate Armor')
        expect(result_item['type']).to eq('ArmorItem')
      end

      it 'returns custom item for a DM' do
        get "/v1/items/#{item_custom2.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Other UserProps Item')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'returns Plate Armor' do
        get "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Plate Armor')
        expect(result_item['type']).to eq('ArmorItem')
      end

      it 'returns a custom DM item' do
        get "/v1/items/#{item_custom1.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('DM Item')
      end

      it 'returns error for DM trying to get custom item by another user' do
        get "/v1/items/#{item_custom2.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'POST Create Item' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user creating item' do
        expect {
          post '/v1/armor_items.json', params: { armor_item: armor_item_attributes }
        }.to change(Item, :count).by(0)
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'creates a new GearItem' do
        expect {
          post '/v1/gear_items.json', params: { gear_item: gear_item_attributes }
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Gear Item')
        expect(result_item['type']).to eq('GearItem')
        expect(result_item['userId']).to be_nil
      end

      it 'creates a new ArmorItem' do
        expect {
          post '/v1/armor_items.json', params: { armor_item: armor_item_attributes }
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Half Plate')
        expect(result_item['type']).to eq('ArmorItem')
        expect(result_item['userId']).to be_nil
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'creates a new GearItem with a user' do
        expect {
          post '/v1/gear_items.json', params: { gear_item: gear_item_attributes }
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Gear Item')
        expect(result_item['type']).to eq('GearItem')
        expect(result_item['userId']).not_to be_nil
      end

      it 'creates a new ArmorItem with a user' do
        expect {
          post '/v1/armor_items.json', params: { armor_item: armor_item_attributes }
        }.to change(Item, :count).by(1)
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('New Half Plate')
        expect(result_item['type']).to eq('ArmorItem')
        expect(result_item['userId']).not_to be_nil
      end
    end
  end

  describe 'PUT Update Item' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user editing' do
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
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'updates the requested item belonging to DM' do
        put "/v1/items/#{item_custom1.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited'
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['name']).to eq('Test Item Edited')
      end

      it 'returns an error for non-admin editing default item' do
        put "/v1/armor_items/#{armor_item.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited',
            armor_class: 19,
            armor_class_bonus: 2
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin editing other DM\'s item' do
        put "/v1/armor_items/#{item_custom2.slug}.json", params: {
          armor_item: {
            name: 'Test Item Edited',
            armor_class: 19,
            armor_class_bonus: 2
          }
        }
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE Delete Item' do
    context 'for Logged Out Users' do
      it 'returns an error for non-user delete' do
        delete "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['error']).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        # sign_in admin
      end

      it 'deletes the requested item belonging to DM' do
        delete "/v1/armor_items/#{item_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'deletes the requested default item' do
        delete "/v1/armor_items/#{armor_item.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        # sign_in dungeon_master
      end

      it 'deletes the requested item belonging to DM' do
        delete "/v1/armor_items/#{item_custom1.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'returns an error for non-admin deleting default item' do
        delete "/v1/armor_items/#{armor_item.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end

      it 'returns an error for non-admin deleting other DM\'s item' do
        delete "/v1/armor_items/#{item_custom2.slug}.json"
        result_item = JSON.parse(response.body)
        expect(result_item['errors']).to eq('UserProps action not allowed.')
      end
    end
  end
end
