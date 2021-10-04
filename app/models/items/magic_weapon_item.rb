# frozen_string_literal: true

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

class MagicWeaponItem < Item
  def category
    'Magic Weapon Item'
  end

  class << self
    def create_magic_weapon_from_old_magic_items(magic_item)
      case magic_item[:type]
      when 'Weapon (trident)'
        new_magic_weapon(magic_item, 'Trident')
      when 'Weapon (scimitar)'
        new_magic_weapon(magic_item, 'Scimitar')
      when 'Weapon (longsword)'
        new_magic_weapon(magic_item, 'Longsword')
      when 'Weapon (maul)'
        new_magic_weapon(magic_item, 'Maul')
      when 'Weapon (warhammer)'
        new_magic_weapon(magic_item, 'Warhammer')
      when 'Weapon (longbow)'
        new_magic_weapon(magic_item, 'Longbow')
      when 'Weapon (dagger)'
        new_magic_weapon(magic_item, 'Dagger')
      when 'Weapon (mace)'
        new_magic_weapon(magic_item, 'Mace')
      when 'Weapon (javelin)'
        new_magic_weapon(magic_item, 'Javelin')
      when 'Weapon (arrow)'
        MagicItem.create_magic_item_from_old_magic_items(magic_item)
      when 'Weapon (any axe)'
        WeaponItem.all_axes.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      when 'Weapon (any axe or sword)'
        weapons = WeaponItem.all_axes + WeaponItem.all_swords
        weapons.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      when 'Weapon (any sword)'
        WeaponItem.all_swords.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      when 'Weapon (any sword that deals slashing damage)'
        slashing_swords = WeaponItem.all_swords - ['Shortsword']
        slashing_swords.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      when 'Weapon (any)'
        if magic_item[:name] == 'Weapon, +1, +2, or +3'
          ['Weapon +1', 'Weapon +2', 'Weapon +3'].each do |plus_weapon_name|
            magic_item[:name] = plus_weapon_name
            WeaponItem.all_weapons.each do |weapon_name|
              new_magic_weapon(magic_item, weapon_name)
            end
          end
        elsif !WeaponItem.basic_magic_weapons.include?(magic_item[:name])
          WeaponItem.all_weapons.each do |weapon_name|
            new_magic_weapon(magic_item, weapon_name)
          end
        end
      else
        puts "WEAPON unidentified: #{magic_item[:name]} - TYPE #{magic_item[:type]} - ID: #{magic_item.id}"
      end
    end

    def new_magic_weapon(magic_item, weapon_name)
      weapon_item = WeaponItem.find_by(name: weapon_name)
      info = if magic_item[:name] == 'Weapon +1'
               { name: "#{weapon_name} +1", rarity: 'uncommon' }
             elsif magic_item[:name] == 'Weapon +2'
               { name: "#{weapon_name} +2", rarity: 'rare' }
             elsif magic_item[:name] == 'Weapon +3'
               { name: "#{weapon_name} +3", rarity: 'very rare' }
             else
               { name: "#{magic_item[:name]}, #{weapon_name}", rarity: magic_item[:rarity] }
             end
      new_item = MagicWeaponItem.find_or_create_by(name: info[:name])
      new_item.desc = magic_item[:desc] ? [magic_item[:desc]] : weapon_item.desc
      new_item.category_range = weapon_item.category_range
      new_item.damage = Damage.create(
        damage_dice: weapon_item.damage.damage_dice,
        damage_type: weapon_item.damage.damage_type
      ) unless weapon_item.damage.nil?
      new_item.magic_item_type = magic_item[:type]
      new_item.properties = weapon_item.properties
      new_item.item_range = ItemRange.create(
        long: weapon_item.item_range.long,
        normal: weapon_item.item_range.normal
      ) unless weapon_item.item_range.nil?
      new_item.rarity = info[:rarity]
      new_item.requires_attunement = magic_item[:requires_attunement]
      new_item.slug = new_item.name.parameterize
      new_item.special = weapon_item.special
      new_item.item_throw_range = ItemThrowRange.create(
        long: weapon_item.item_throw_range.long,
        normal: weapon_item.item_throw_range.normal
      ) unless weapon_item.item_throw_range.nil?
      new_item.two_handed_damage = TwoHandedDamage.create(
        damage_dice: weapon_item.two_handed_damage.damage_dice,
        damage_type: weapon_item.two_handed_damage.damage_type
      ) unless weapon_item.two_handed_damage.nil?
      new_item.weapon_category = weapon_item.weapon_category
      new_item.weapon_range = weapon_item.weapon_range
      new_item.weight = weapon_item.weight
      new_item.cost = Cost.create(quantity: MagicItemsUtility.cost_for_rarity(magic_item[:rarity]), unit: 'gp')
      new_item.save!
    end
  end
end
