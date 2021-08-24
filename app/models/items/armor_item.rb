# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id                          :bigint           not null, primary key
#  api_url                     :string
#  armor_class                 :integer
#  armor_class_bonus           :integer
#  armor_dex_bonus             :boolean
#  armor_max_bonus             :integer
#  armor_stealth_disadvantage  :boolean
#  armor_str_minimum           :integer
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
#  weapon_attack_bonus         :integer
#  weapon_damage_bonus         :integer
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

class ArmorItem < Item
  def self.basic_armors
    ['Chain Shirt', 'Plate', 'Breastplate', 'Leather', 'Scale Mail', 'Ring Mail', 'Chain Mail', 'Studded Leather', 'Hide', 'Padded', 'Splint', 'Shield', 'Half Plate']
  end

  def category
    'Armor'
  end

  class << self
    def create_magic_armor_from_old_magic_items(magic_item)
      if magic_item[:type].include? 'scale mail'
        new_magic_armor(magic_item, 'Scale Mail')
      elsif magic_item[:type].include? 'chain shirt'
        new_magic_armor(magic_item, 'Chain Shirt')
      elsif magic_item[:type].include? 'studded leather'
        new_magic_armor(magic_item, 'Studded Leather')
      elsif magic_item[:type].include? 'shield'
        new_magic_armor(magic_item, 'Shield')
      elsif magic_item[:type].include? 'plate'
        new_magic_armor(magic_item, 'Plate')
      elsif magic_item[:type].include? 'medium or heavy'
        medium_heavy_armors = ArmorItem.basic_armors - ['Studded Leather', 'Leather', 'Padded']
        medium_heavy_armors.each do |armor_name|
          new_magic_armor(magic_item, armor_name)
        end
      elsif magic_item[:type].include? 'light'
        new_magic_armor(magic_item, 'Studded Leather')
        new_magic_armor(magic_item, 'Leather')
        new_magic_armor(magic_item, 'Padded')
      else
        puts "ARMOR unidentified: #{magic_item[:name]} - TYPE #{magic_item[:type]} - ID: #{magic_item.id}"
      end
    end

    def new_magic_armor(magic_item, armor_name)
      armor_item = ArmorItem.find_by(name: armor_name)
      new_item_name = "#{magic_item[:name]}, #{armor_name}"
      new_item_slug = new_item_name.parameterize
      new_item = ArmorItem.find_or_create_by(slug: new_item_slug)
      new_item.name = new_item_name
      new_item.description = magic_item[:desc]
      new_item.rarity = magic_item[:rarity]
      new_item.requires_attunement = magic_item[:requires_attunement]
      new_item.sub_category = magic_item[:type]
      new_item.slug = new_item_slug
      new_item.armor_class = armor_item.armor_class
      new_item.armor_dex_bonus = armor_item.armor_dex_bonus
      new_item.armor_max_bonus = armor_item.armor_max_bonus
      new_item.armor_stealth_disadvantage = armor_item.armor_stealth_disadvantage
      new_item.armor_str_minimum = armor_item.armor_str_minimum
      new_item.weight = armor_item.weight
      new_item.save!
    end
  end
end
