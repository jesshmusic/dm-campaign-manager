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

RSpec.describe ArmorItem, type: :model do
  context 'with the same name' do
    let!(:dungeon_master) { create :dungeon_master_user }

    it 'generates unique slugs' do
      @item = ArmorItem.create!(name: 'Torch', weight: 10)
      @item1 = ArmorItem.create!(name: 'Torch', weight: 10)
      @user_item = ArmorItem.create!(name: 'Torch', weight: 10, user: dungeon_master)
      expect(@item.slug).to eq('torch-1')
      expect(@item1.slug).to eq('torch-2')
      expect(@user_item.slug).to eq('torch-jesshdm1')
    end

    it 'maintains same slug on update with no name change' do
      @item = ArmorItem.create!(name: 'Torch', weight: 10)
      @item1 = ArmorItem.create!(name: 'Torch', weight: 10)
      @user_item = ArmorItem.create!(name: 'Torch', weight: 10, user: dungeon_master)
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(ArmorItem.all.count).to eq(51)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 8)
      expect(ArmorItem.all.count).to eq(51)
      @item.reload
      expect(@item.slug).to eq('torch-1')
      @item.update(weight: 12)
      expect(ArmorItem.all.count).to eq(51)
      @item.reload
      expect(@item.slug).to eq('torch-1')
    end
  end
  context 'Implementation' do
    it 'should have 13 ArmorItems' do
      expect(ArmorItem.all.count).to eq(48)
    end

    it 'should have the Armor category' do
      expect(ArmorItem.first.category).to eq('Armor')
    end

    armor_types = { 'scale mail': 1, 'chain shirt': 1, 'studded leather': 1, 'shield': 1, 'plate': 1, 'medium or heavy': 10, 'light': 3 }
    armor_types.each do |armor_type, number_of_armors|
      it 'should create a magic armor from an imported JSON' do
        magic_item = {
          'slug': 'adamantine-armor-special',
          'name': 'Adamantine Armor Special',
          'type': "Armor (#{armor_type})",
          'desc': 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any critical hit against you becomes a normal hit.',
          'rarity': 'uncommon',
          'requires_attunement': '',
          'document__slug': 'wotc-srd',
          'document__title': 'Systems Reference Document'
        }
        expect(MagicArmorItem.all.count).to eq(48)
        MagicArmorItem.create_magic_armor_from_old_magic_items(magic_item)
        expect(MagicArmorItem.all.count).to eq(48 + number_of_armors)
        new_armors = MagicArmorItem.where('name like ?', '%Adamantine Armor Special%')
        expect(new_armors).not_to be(nil)
        expect(new_armors.count).to eq(number_of_armors)
        expect(new_armors.first.cost.quantity).to eq(500)
        expect(new_armors.first.cost.unit).to eq('gp')
        expect(new_armors.first.name).to include('Adamantine Armor Special')
      end
    end

    it 'should catch unidentified armor types' do
      magic_item = {
        'slug': 'adamantine-armor-special',
        'name': 'Adamantine Armor Special',
        'type': 'Armor (oops)',
        'desc': 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any critical hit against you becomes a normal hit.',
        'rarity': 'uncommon',
        'requires_attunement': '',
        'document__slug': 'wotc-srd',
        'document__title': 'Systems Reference Document'
      }
      expect(MagicArmorItem.all.count).to eq(48)
      expect {
        MagicArmorItem.create_magic_armor_from_old_magic_items(magic_item)
      }.to output("ARMOR unidentified: Adamantine Armor Special - TYPE Armor (oops)\n")
             .to_stdout
      expect(MagicArmorItem.all.count).to eq(48)
    end
  end
end
