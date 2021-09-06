# == Schema Information
#
# Table name: items
#
#  id                   :bigint           not null, primary key
#  api_url              :string
#  armor_category       :string
#  armor_class          :jsonb
#  armor_class_bonus    :integer
#  capacity             :string
#  category_range       :string
#  contents             :jsonb            is an Array
#  cost                 :jsonb
#  damage               :jsonb
#  desc                 :string           default([]), is an Array
#  equipment_category   :string
#  gear_category        :string
#  name                 :string
#  properties           :string           default([]), is an Array
#  quantity             :integer
#  range                :jsonb
#  rarity               :string
#  requires_attunement  :string
#  slug                 :string
#  special              :string           default([]), is an Array
#  speed                :jsonb
#  stealth_disadvantage :boolean
#  str_minimum          :integer
#  throw_range          :jsonb
#  tool_category        :string
#  two_handed_damage    :jsonb
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

RSpec.describe GearItem, type: :model do
  context "with the same name" do
    before(:each) do
      dungeon_master = FactoryBot.create(:dungeon_master_user)
      @item = GearItem.create!(name: 'Torch', weight: 10)
      @item1 = GearItem.create!(name: 'Torch', weight: 10)
      @user_item = GearItem.create!(name: 'Torch', weight: 10, user: dungeon_master)
    end

    it "generates unique slugs" do
      expect(@item.slug).to eq('torch')
      expect(@item1.slug).to eq('torch-1')
      expect(@user_item.slug).to eq('torch-jesshdm')
    end

    it "maintains same slug on update with no name change" do
      expect(@item.slug).to eq('torch')
      @item.update(weight: 12)
      expect(GearItem.all.count).to eq(3)
      @item.reload
      expect(@item.slug).to eq('torch')
      @item.update(weight: 8)
      expect(GearItem.all.count).to eq(3)
      @item.reload
      expect(@item.slug).to eq('torch')
      @item.update(weight: 12)
      expect(GearItem.all.count).to eq(3)
      @item.reload
      expect(@item.slug).to eq('torch')
    end
  end
end
