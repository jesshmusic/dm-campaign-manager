# frozen_string_literal: true

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
#  damage               :jsonb
#  desc                 :string           default([]), is an Array
#  equipment_category   :string
#  gear_category        :string
#  magic_item_type      :string
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

# TODO: It seems like the ranged weapons are missing their range values.

class WeaponItem < Item
  def self.all_weapons
    ['Shortsword', 'Mace', 'Pike', 'Crossbow, light', 'Halberd', 'Dart', 'Battleaxe', 'Glaive', 'Sling', 'Whip', 'Sickle', 'Crossbow, hand', 'Greataxe', 'Spear', 'Greatsword', 'Net', 'Javelin', 'Flail', 'Blowgun', 'Maul', 'Quarterstaff', 'Greatclub', 'Handaxe', 'War pick', 'Scimitar', 'Club', 'Longsword', 'Rapier', 'Trident', 'Dagger', 'Lance', 'Morningstar', 'Light hammer', 'Warhammer', 'Longbow', 'Shortbow', 'Crossbow, heavy']
  end

  def self.all_swords
    %w[Shortsword Greatsword Scimitar Longsword Rapier]
  end

  def self.all_axes
    %w[Battleaxe Greataxe Handaxe]
  end

  def self.basic_magic_weapons
    [
      'Sling +1', 'Battleaxe +1', 'Flail +1', 'Glaive +1', 'Greataxe +1', 'Greatsword +1', 'Halberd +1', 'Longsword +1', 'Maul +1', 'Morningstar +1', 'Pike +1', 'Rapier +1', 'Scimitar +1', 'Shortsword +1', 'War pick +1', 'Warhammer +1', 'Whip +1', 'Blowgun +1', 'Crossbow, hand +1', 'Crossbow, heavy +1', 'Longbow +1', 'Lance +1', 'Trident +1', 'Net +1', 'Ammunition +1', 'Club +2', 'Dagger +2', 'Club +1', 'Dagger +1', 'Greatclub +1', 'Handaxe +1', 'Javelin +1', 'Light hammer +1', 'Mace +1', 'Quarterstaff +1', 'Sickle +1', 'Spear +1', 'Crossbow, light +1', 'Dart +1', 'Shortbow +1', 'Greatclub +2', 'Handaxe +2', 'Javelin +2', 'Light hammer +2', 'Mace +2', 'Quarterstaff +2', 'Sickle +2', 'Spear +2', 'Crossbow, light +2', 'Dart +2', 'Shortbow +2', 'Sling +2', 'Battleaxe +2', 'Flail +2', 'Glaive +2', 'Greataxe +2', 'Greatsword +2', 'Halberd +2', 'Longsword +2', 'Maul +2', 'Morningstar +2', 'Pike +2', 'Rapier +2', 'Scimitar +2', 'Shortsword +2', 'War pick +2', 'Warhammer +2', 'Whip +2', 'Blowgun +2', 'Crossbow, hand +2', 'Crossbow, heavy +2', 'Longbow +2', 'Lance +2', 'Trident +2', 'Net +2', 'Ammunition +2', 'Club +3', 'Dagger +3', 'Greatclub +3', 'Handaxe +3', 'Javelin +3', 'Light hammer +3', 'Mace +3', 'Quarterstaff +3', 'Sickle +3', 'Spear +3', 'Crossbow, light +3', 'Dart +3', 'Shortbow +3', 'Sling +3', 'Battleaxe +3', 'Flail +3', 'Glaive +3', 'Greataxe +3', 'Greatsword +3', 'Halberd +3', 'Longsword +3', 'Maul +3', 'Morningstar +3', 'Pike +3', 'Rapier +3', 'Scimitar +3', 'Shortsword +3', 'War pick +3', 'Warhammer +3', 'Whip +3', 'Blowgun +3', 'Crossbow, hand +3', 'Crossbow, heavy +3', 'Longbow +3', 'Lance +3', 'Trident +3', 'Net +3', 'Ammunition +3'
    ]
  end

  def category
    'Weapon'
  end

  class << self
    def create_magic_weapon_from_old_magic_items(magic_item)
      if magic_item[:type] == 'Weapon (trident)'
        new_magic_weapon(magic_item, 'Trident')
      elsif magic_item[:type] == 'Weapon (scimitar)'
        new_magic_weapon(magic_item, 'Scimitar')
      elsif magic_item[:type] == 'Weapon (longsword)'
        new_magic_weapon(magic_item, 'Longsword')
      elsif magic_item[:type] == 'Weapon (maul)'
        new_magic_weapon(magic_item, 'Maul')
      elsif magic_item[:type] == 'Weapon (warhammer)'
        new_magic_weapon(magic_item, 'Warhammer')
      elsif magic_item[:type] == 'Weapon (longbow)'
        new_magic_weapon(magic_item, 'Longbow')
      elsif magic_item[:type] == 'Weapon (dagger)'
        new_magic_weapon(magic_item, 'Dagger')
      elsif magic_item[:type] == 'Weapon (mace)'
        new_magic_weapon(magic_item, 'Mace')
      elsif magic_item[:type] == 'Weapon (javelin)'
        new_magic_weapon(magic_item, 'Javelin')
      elsif magic_item[:type] == 'Weapon (arrow)'
        MagicItem.create_magic_item_from_old_magic_items(magic_item)
      elsif magic_item[:type] == 'Weapon (any axe)'
        WeaponItem.all_axes.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      elsif magic_item[:type] == 'Weapon (any axe or sword)'
        weapons = WeaponItem.all_axes + WeaponItem.all_swords
        weapons.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      elsif magic_item[:type] == 'Weapon (any sword)'
        WeaponItem.all_swords.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      elsif magic_item[:type] == 'Weapon (any sword that deals slashing damage)'
        slashing_swords = WeaponItem.all_swords - ['Shortsword']
        slashing_swords.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      elsif magic_item[:type] == 'Weapon (any)'
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
      new_item = WeaponItem.find_or_create_by(name: "#{magic_item[:name]}, #{weapon_name}")
      new_item.desc = magic_item[:desc]
      new_item.requires_attunement = magic_item[:requires_attunement]
      new_item.rarity = magic_item[:rarity]
      new_item.cost = Cost.create(quantity: MagicItemsUtility.cost_for_rarity(magic_item[:rarity]), unit: 'gp')
      new_item.slug = new_item.name.parameterize
      new_item.damage = weapon_item.damage
      new_item.throw_range = weapon_item.throw_range
      new_item.two_handed_damage = weapon_item.two_handed_damage
      new_item.weapon_category = weapon_item.weapon_category
      new_item.weapon_range = weapon_item.weapon_range
      new_item.category_range = weapon_item.category_range
      new_item.weight = weapon_item.weight
      new_item.save!
    end
  end
end
