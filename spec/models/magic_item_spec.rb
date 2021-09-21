# == Schema Information
#
# Table name: items
#
#  id                   :bigint           not null, primary key
#  api_url              :string
#  armor_category       :string
#  armor_class_bonus    :integer
#  capacity             :string
#  category_range       :string
#  desc                 :string           default([]), is an Array
#  equipment_category   :string
#  gear_category        :string
#  magic_item_type      :string
#  name                 :string
#  properties           :string           default([]), is an Array
#  quantity             :integer
#  rarity               :string
#  requires_attunement  :string
#  slug                 :string
#  special              :string           default([]), is an Array
#  speed                :string
#  stealth_disadvantage :boolean
#  str_minimum          :integer
#  tool_category        :string
#  type                 :string
#  vehicle_category     :string
#  weapon_category      :string
#  weapon_range         :string
#  weight               :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  user_id              :bigint
#
# Indexes
#
#  index_items_on_armor_category    (armor_category)
#  index_items_on_category_range    (category_range)
#  index_items_on_slug              (slug) UNIQUE
#  index_items_on_tool_category     (tool_category)
#  index_items_on_user_id           (user_id)
#  index_items_on_vehicle_category  (vehicle_category)
#  index_items_on_weapon_category   (weapon_category)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe MagicItem, type: :model do
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:magic_item_1) {
    create :item,
           name: 'Amulet of Proof against Detection and Location',
           type: 'Magic Item',
           magic_item_type: 'Wondrous item'
  }
  let!(:magic_item_2) {
    create :item,
           name: 'Apparatus of the Crab',
           type: 'Magic Item',
           magic_item_type: 'Wondrous item'
  }
  let!(:magic_item_3) {
    create :item,
           name: 'Arrow of Slaying',
           type: 'Magic Item',
           magic_item_type: 'Weapon (arrow)'
  }

  context 'with the same name' do
    it 'generates unique slugs' do
      @item = MagicItem.create!(name: 'Torch', weight: 10, rarity: 'uncommon')
      @item1 = MagicItem.create!(name: 'Torch', weight: 10, rarity: 'uncommon')
      @user_item = MagicItem.create!(name: 'Torch', weight: 10, user: dungeon_master, rarity: 'uncommon')
      expect(@item.slug).to eq('torch-1')
      expect(@item1.slug).to eq('torch-2')
      expect(@user_item.slug).to eq('torch-jesshdm1')
    end

    it 'maintains same slug on update with no name change' do
      @item = MagicItem.create!(name: 'Torch', weight: 10, rarity: 'uncommon')
      @item1 = MagicItem.create!(name: 'Torch', weight: 10, rarity: 'uncommon')
      @user_item = MagicItem.create!(name: 'Torch', weight: 10, user: dungeon_master, rarity: 'uncommon')
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(MagicItem.all.count).to eq(247)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 8)
      expect(MagicItem.all.count).to eq(247)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(MagicItem.all.count).to eq(247)
      @item.reload
      expect(@item.slug).to eq('torch-1')
    end

    it 'should create a magic item from an imported JSON' do
      magic_item = {
        'slug': 'amulet-of-health',
        'name': 'Amulet of Health',
        'type': 'Wondrous item',
        'desc': 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
        'rarity': 'rare',
        'requires_attunement': 'requires attunement',
        'document__slug': 'wotc-srd',
        'document__title': 'Systems Reference Document'
      }
      expect(MagicItem.all.count).to eq(244)
      MagicItem.create_magic_item_from_old_magic_items(magic_item)
      expect(MagicItem.all.count).to eq(244)
      magic_items = MagicItem.where('name like ?', '%Amulet of Health%')
      expect(magic_items).not_to be(nil)
      expect(magic_items.count).to eq(1)
      expect(magic_items.first.cost.quantity).to eq(5000)
      expect(magic_items.first.category).to eq('Magic Item')
      expect(magic_items.first.magic_item_type).to eq('Wondrous item')
      expect(magic_items.first.cost.unit).to eq('gp')
      expect(magic_items.first.name).to include('Amulet of Health')
    end

    it 'should update a magic item that already exists' do
      magic_item = {
        'slug': 'amulet-of-health',
        'name': 'Amulet of Health',
        'type': 'Wondrous item',
        'desc': 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
        'rarity': 'rare',
        'requires_attunement': 'requires attunement',
        'document__slug': 'wotc-srd',
        'document__title': 'Systems Reference Document'
      }
      expect(MagicItem.all.count).to eq(244)
      MagicItem.create_magic_item_from_old_magic_items(magic_item)
      expect(MagicItem.all.count).to eq(244)
      expect(MagicItem.first.rarity).to eq('rare')
      magic_item[:rarity] = 'very rare'
      MagicItem.create_magic_item_from_old_magic_items(magic_item)
      expect(MagicItem.all.count).to eq(244)
      expect(MagicItem.first.rarity).to eq('very rare')
    end
  end
end
