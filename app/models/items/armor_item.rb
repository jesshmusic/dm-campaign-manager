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
      new_item.armor_class = armor_item ? armor_item.armor_class : 10
      new_item.armor_dex_bonus = armor_item ? armor_item.armor_dex_bonus : true
      new_item.armor_max_bonus = armor_item ? armor_item.armor_max_bonus : 2
      new_item.armor_stealth_disadvantage = armor_item ? armor_item.armor_stealth_disadvantage : true
      new_item.armor_str_minimum = armor_item.armor_str_minimum unless armor_item.nil?
      new_item.weight = armor_item ? armor_item.weight : 10
      # new_item.cost_unit =
      new_item.save!
    end
  end
end
