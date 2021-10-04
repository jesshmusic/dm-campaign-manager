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

class MagicArmorItem < ArmorItem
  def category
    'Magic Armor Item'
  end

  class << self
    def basic_armors
      ['Chain Shirt', 'Plate', 'Breastplate', 'Leather', 'Scale Mail', 'Ring Mail', 'Chain Mail', 'Studded Leather', 'Hide', 'Padded', 'Splint', 'Shield', 'Half Plate']
    end

    def create_magic_armor_from_old_magic_items(magic_item)
      if magic_item[:type].include? 'scale mail'
        magic_item[:name] = "#{magic_item[:name]}, Scale Mail"
        new_magic_armor(magic_item, 'Scale Mail')
      elsif magic_item[:type].include? 'chain shirt'
        magic_item[:name] = "#{magic_item[:name]}, Chain Shirt"
        new_magic_armor(magic_item, 'Chain Shirt')
      elsif magic_item[:type].include? 'studded leather'
        magic_item[:name] = "#{magic_item[:name]}, Studded Leather"
        new_magic_armor(magic_item, 'Studded Leather')
      elsif magic_item[:type].include? 'shield'
        magic_item[:name] = "#{magic_item[:name]}, Shield"
        new_magic_armor(magic_item, 'Shield')
      elsif magic_item[:type].include? 'plate'
        magic_item[:name] = "#{magic_item[:name]}, Plate"
        new_magic_armor(magic_item, 'Plate')
      elsif magic_item[:type].include? 'medium or heavy'
        medium_heavy_armors = MagicArmorItem.basic_armors - ['Studded Leather', 'Leather', 'Padded']
        magic_item_name = "#{magic_item[:name]}"
        medium_heavy_armors.each do |armor_name|
          magic_item[:name] = "#{magic_item_name}, #{armor_name}"
          new_magic_armor(magic_item, armor_name)
        end
      elsif magic_item[:type].include? 'light'
        magic_item[:name] = "#{magic_item[:name]}, Studded Leather"
        new_magic_armor(magic_item, 'Studded Leather')
        magic_item[:name] = "#{magic_item[:name]}, Leather"
        new_magic_armor(magic_item, 'Leather')
        magic_item[:name] = "#{magic_item[:name]}, Padded"
        new_magic_armor(magic_item, 'Padded')
      else
        puts "ARMOR unidentified: #{magic_item[:name]} - TYPE #{magic_item[:type]}"
      end
    end

    def new_magic_armor(magic_item, armor_name)
      armor_item = ArmorItem.find_by(name: armor_name)
      new_item = MagicArmorItem.find_or_create_by(name: magic_item[:name])
      unless armor_item.nil?
        new_item.armor_category = armor_item.armor_category
        new_item.armor_class = ArmorClass.create(
          ac_base: armor_item.armor_class.ac_base,
          has_dex_bonus: armor_item.armor_class.has_dex_bonus,
          max_dex_bonus: armor_item.armor_class.max_dex_bonus
        )
        new_item.armor_class_bonus = armor_item.armor_class_bonus
        new_item.properties = armor_item.properties
        new_item.special = armor_item.special
        new_item.stealth_disadvantage = armor_item.stealth_disadvantage
        new_item.str_minimum = armor_item.str_minimum
        new_item.weight = armor_item.weight
      end
      new_item.desc << magic_item[:desc]
      new_item.magic_item_type = magic_item[:type]
      new_item.rarity = magic_item[:rarity]
      new_item.requires_attunement = magic_item[:requires_attunement]
      new_item.slug = new_item.name.parameterize
      new_item.cost = Cost.create(quantity: MagicItemsUtility.cost_for_rarity(magic_item[:rarity]), unit: 'gp')

      new_item.save!
    end
  end
end
