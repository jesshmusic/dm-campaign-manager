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

class WeaponItem < Item
  def properties_str
    prop_arr = []
    properties.each do |property|
      prop_str = "#{property}"
      case property.downcase
      when 'thrown'
        prop_str = prop_str + " (range #{item_throw_range.normal}/#{item_throw_range.long})" unless item_throw_range.nil?
      when 'ammunition'
        prop_str = prop_str + " (range #{item_range.normal}/#{item_range.long})" unless item_range.nil?
      when 'versatile'
        prop_str = prop_str + " (#{two_handed_damage.damage_dice})" unless two_handed_damage.nil?
      end
      prop_arr << prop_str
    end
    prop_arr.join(', ')
  end

  def self.all_weapons
    ['Shortsword', 'Mace', 'Pike', 'Crossbow, light', 'Halberd', 'Dart', 'Battleaxe', 'Glaive', 'Sling', 'Whip', 'Sickle', 'Crossbow, hand', 'Greataxe', 'Spear', 'Greatsword', 'Net', 'Javelin', 'Flail', 'Blowgun', 'Maul', 'Quarterstaff', 'Greatclub', 'Handaxe', 'War pick', 'Scimitar', 'Club', 'Longsword', 'Rapier', 'Trident', 'Dagger', 'Lance', 'Morningstar', 'Light hammer', 'Warhammer', 'Longbow', 'Shortbow', 'Crossbow, heavy']
  end

  def self.melee_weapons
    ['Shortsword', 'Mace', 'Pike', 'Halberd', 'Battleaxe', 'Glaive', 'Whip', 'Sickle', 'Greataxe', 'Spear', 'Greatsword', 'Javelin', 'Flail', 'Maul', 'Quarterstaff', 'Greatclub', 'Handaxe', 'War pick', 'Scimitar', 'Club', 'Longsword', 'Rapier', 'Trident', 'Dagger', 'Lance', 'Morningstar', 'Light hammer', 'Warhammer']
  end

  def self.ranged_weapons
    ['Crossbow, light', 'Dart', 'Sling', 'Crossbow, hand', 'Blowgun', 'Longbow', 'Shortbow', 'Crossbow, heavy']
  end

  def self.fighter_weapons
    WeightedList['Shortsword': 20, 'Mace': 15, 'Pike': 3, 'Halberd': 3, 'Battleaxe': 20, 'Glaive': 3, 'Whip': 1,
                 'Sickle': 5, 'Greataxe': 20, 'Spear': 20, 'Greatsword': 30, 'Javelin': 15, 'Flail': 15, 'Maul': 15,
                 'Quarterstaff': 3, 'Greatclub': 15, 'Handaxe': 10, 'War pick': 5, 'Scimitar': 15, 'Club': 8,
                 'Longsword': 30, 'Rapier': 15, 'Trident': 13, 'Dagger': 15, 'Lance': 1, 'Morningstar': 15,
                 'Light hammer': 10, 'Warhammer': 20]
  end

  def self.rogue_weapons
    WeightedList['Shortsword': 75, 'Whip': 1, 'Quarterstaff': 3, 'Handaxe': 10, 'Scimitar': 15, 'Club': 8,
                 'Longsword': 30, 'Rapier': 15, 'Dagger': 100]
  end

  def self.caster_weapons
    WeightedList['Shortsword': 5, 'Mace': 10, 'Sickle': 5, 'Spear': 5, 'Quarterstaff': 35, 'Scimitar': 5,
                 'Longsword': 8, 'Rapier': 12, 'Dagger': 25, 'Morningstar': 2,
                 'Light hammer': 5]
  end

  def self.ranged_weighted
    WeightedList['Crossbow, light': 15, 'Dart': 3, 'Sling': 2, 'Crossbow, hand': 5, 'Blowgun': 2, 'Longbow': 25,
                 'Shortbow': 35, 'Crossbow, heavy': 10]
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
end
