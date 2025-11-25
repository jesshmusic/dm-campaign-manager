class ItemsUtil
  class << self
    delegate :dnd_api_url, to: :ImportSrdUtilities

    delegate :dnd_open5e_url, to: :ImportSrdUtilities

    def import
      import_initial_items
    end

    def generate_actions_from_weapons
      WeaponItem.find_each do |weapon|
        create_weapon_action(weapon)
      end
      MagicWeaponItem.find_each do |weapon|
        create_weapon_action(weapon)
      end
    end

    private

    def create_weapon_action(weapon)
      wpn_damage = weapon.damage || nil
      return unless wpn_damage

      wpn_action = parse_action_hash(weapon)
      desc = NpcGenerator.generate_action_desc(wpn_action)
      return if MonsterAction.find_by(name: weapon.name)

      MonsterAction.create!(name: weapon.name, desc: desc)
      Rails.logger.debug { "Created Monster Action: \"#{weapon.name}\"" }
    end

    def parse_action_hash(weapon)
      parsed_dice = DndRules.parse_dice_string(weapon.damage.damage_dice)
      parsed_2h_dice = weapon.two_handed_damage ? DndRules.parse_dice_string(weapon.two_handed_damage.damage_dice) : nil
      {
        params: {
          action: {
            action_type: 'attack',
            name: weapon.name,
            damage: {
              damage_type: weapon.damage.damage_type,
              num_dice: parsed_dice[:hit_dice_number],
              dice_value: parsed_dice[:hit_dice_value],
              is_ranged: weapon.weapon_range == 'Ranged',
              num_targets: 1,
              reach: weapon.item_range.normal,
              range_normal: weapon.item_range.normal,
              range_long: weapon.item_range.long
            },
            two_handed_damage: {
              damage_type: weapon.two_handed_damage&.damage_type,
              num_dice: parsed_2h_dice ? parsed_2h_dice[:hit_dice_number] : nil,
              dice_value: parsed_2h_dice ? parsed_2h_dice[:hit_dice_value] : nil
            }
          },
          attack_bonus: 6,
          prof_bonus: 3,
          damage_bonus: 6
        }
      }
    end

    def import_initial_items
      uri = URI("#{dnd_api_url}/api/equipment")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0

      result[:results].each do |equipment_item|
        item_uri = URI("#{dnd_api_url}#{equipment_item[:url]}")
        item_response = Net::HTTP.get(item_uri)
        item_result = JSON.parse item_response, symbolize_names: true
        db_item = Item.find_or_create_by!(name: equipment_item[:name])
        set_item_info(db_item, item_result)
        set_equipment_category(db_item, item_result)
        set_armor_info(db_item, item_result)
        set_contents(db_item, item_result)
        set_weapon_info(db_item, item_result)
        set_vehicle_info(db_item, item_result)
        db_item.save!
        Rails.logger.debug { "\tItem #{db_item.name} (\"#{db_item.equipment_category}\") imported." }
        count += 1
      end
      Rails.logger.debug { "#{count} Items imported." }
    end

    def set_item_info(db_item, item_result)
      db_item.api_url = "/v1/items/#{item_result[:index]}"
      db_item.desc = item_result[:desc]
      if item_result[:cost]
        db_item.cost = Cost.create(
          quantity: item_result[:cost][:quantity],
          unit: item_result[:cost][:unit]
        )
      end
      db_item.equipment_category = item_result[:equipment_category][:name]
      db_item.gear_category = item_result[:gear_category][:name] unless item_result[:gear_category].nil?
      db_item.quantity = item_result[:quantity]
      db_item.special = item_result[:special]
      db_item.tool_category = item_result[:tool_category]
      db_item.weight = item_result[:weight] || 0
    end

    def set_equipment_category(db_item, item_result)
      db_item.type = if item_result[:equipment_category].nil?
                       'GearItem'
                     else
                       case item_result[:equipment_category][:name]
                       when 'Armor'
                         'ArmorItem'
                       when 'Weapon'
                         'WeaponItem'
                       when 'Tools'
                         'ToolItem'
                       when 'Adventuring Gear'
                         'GearItem'
                       when 'Mounts and Vehicles'
                         'VehicleItem'
                       else
                         'GearItem'
                       end
                     end
    end

    def set_armor_info(db_item, item_result)
      db_item.armor_category = item_result[:armor_category]
      unless item_result[:armor_class].nil?
        db_item.armor_class = ArmorClass.create(
          ac_base: item_result[:armor_class][:base],
          has_dex_bonus: item_result[:armor_class][:dex_bonus],
          max_dex_bonus: item_result[:armor_class][:max_bonus]
        )
      end
      db_item.stealth_disadvantage = item_result[:stealth_disadvantage]
      db_item.str_minimum = item_result[:str_minimum]
    end

    def set_contents(db_item, item_result)
      return if item_result[:contents].nil? || item_result[:contents].none?

      item_result[:contents].each do |item|
        db_item.content_items.create(index: item[:item][:index],
                                     name: item[:item][:name],
                                     quantity: item[:quantity])
      end
    end

    def set_weapon_info(db_item, item_result)
      db_item.category_range = item_result[:category_range]
      unless item_result[:damage].nil?
        db_item.damage = Damage.create(
          damage_dice: item_result[:damage][:damage_dice],
          damage_type: item_result[:damage][:damage_type][:index]
        )
      end
      unless item_result[:two_handed_damage].nil?
        db_item.two_handed_damage = TwoHandedDamage.create(
          damage_dice: item_result[:two_handed_damage][:damage_dice],
          damage_type: item_result[:two_handed_damage][:damage_type][:index]
        )
      end
      item_result[:properties]&.each do |prop|
        db_item.properties |= [prop[:name]]
      end
      unless item_result[:range].nil?
        db_item.item_range = ItemRange.create(
          long: item_result[:range][:long],
          normal: item_result[:range][:normal]
        )
      end
      unless item_result[:throw_range].nil?
        db_item.item_throw_range = ItemThrowRange.create(
          long: item_result[:throw_range][:long],
          normal: item_result[:throw_range][:normal]
        )
      end
      db_item.weapon_category = item_result[:weapon_category]
      db_item.weapon_range = item_result[:weapon_range]
    end

    def set_vehicle_info(db_item, item_result)
      db_item.capacity = item_result[:capacity]
      db_item.vehicle_category = item_result[:vehicle_category]
      db_item.speed = "#{item_result[:speed][:quantity]} #{item_result[:speed][:unit]}" unless item_result[:speed].nil?
    end
  end
end
