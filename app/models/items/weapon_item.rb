# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id                          :bigint           not null, primary key
#  api_url                     :string
#  armor_class                 :integer
#  armor_dex_bonus             :boolean
#  armor_max_bonus             :integer
#  armor_stealth_disadvantage  :boolean
#  armor_str_minimum           :integer
#  category                    :string
#  category_range              :string
#  cost_unit                   :string
#  cost_value                  :integer
#  description                 :text
#  name                        :string
#  rarity                      :string
#  requires_attunement         :string
#  slug                        :string
#  sub_category                :string
#  type                        :string
#  vehicle_capacity            :string
#  vehicle_speed               :integer
#  vehicle_speed_unit          :string
#  weapon_2h_damage_dice_count :integer
#  weapon_2h_damage_dice_value :integer
#  weapon_2h_damage_type       :string
#  weapon_damage_dice_count    :integer
#  weapon_damage_dice_value    :integer
#  weapon_damage_type          :string
#  weapon_properties           :string           default([]), is an Array
#  weapon_range                :string
#  weapon_range_long           :integer
#  weapon_range_normal         :integer
#  weapon_thrown_range_long    :integer
#  weapon_thrown_range_normal  :integer
#  weight                      :integer
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  user_id                     :bigint
#
# Indexes
#
#  index_items_on_slug     (slug) UNIQUE
#  index_items_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

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
end
