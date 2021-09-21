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

RSpec.describe WeaponItem, type: :model do
  context 'with the same name' do
    let!(:dungeon_master) { create :dungeon_master_user }

    it 'generates unique slugs' do
      @item = WeaponItem.create!(name: 'Torch', weight: 10)
      @item1 = WeaponItem.create!(name: 'Torch', weight: 10)
      @user_item = WeaponItem.create!(name: 'Torch', weight: 10, user: dungeon_master)
      expect(@item.slug).to eq('torch-1')
      expect(@item1.slug).to eq('torch-2')
      expect(@user_item.slug).to eq('torch-jesshdm1')
    end

    it 'maintains same slug on update with no name change' do
      @item = WeaponItem.create!(name: 'Torch', weight: 10)
      @item1 = WeaponItem.create!(name: 'Torch', weight: 10)
      @user_item = WeaponItem.create!(name: 'Torch', weight: 10, user: dungeon_master)
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(WeaponItem.all.count).to eq(268)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 8)
      expect(WeaponItem.all.count).to eq(268)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(WeaponItem.all.count).to eq(268)
      @item.reload
      expect(@item.slug).to eq('torch-1')
    end
  end
end
