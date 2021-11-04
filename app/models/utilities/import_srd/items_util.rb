class ItemsUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import
      import_initial_items
    end

    private

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
        puts "\tItem #{db_item.name} (\"#{db_item.equipment_category}\") imported."
        count += 1
      end
      puts "#{count} Items imported."
    end

    def set_item_info(db_item, item_result)
      db_item.api_url = "/v1/items/#{item_result[:index]}"
      db_item.desc = item_result[:desc]
      db_item.cost = Cost.create(
        quantity: item_result[:cost][:quantity],
        unit: item_result[:cost][:unit]
      ) if item_result[:cost]
      db_item.equipment_category = item_result[:equipment_category][:name]
      db_item.gear_category = item_result[:gear_category][:name] unless item_result[:gear_category].nil?
      db_item.quantity = item_result[:quantity]
      db_item.special = item_result[:special]
      db_item.tool_category = item_result[:tool_category]
      db_item.weight = item_result[:weight] || 0
    end

    def set_equipment_category(db_item, item_result)
      if !item_result[:equipment_category].nil?
        db_item.type = case item_result[:equipment_category][:name]
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
      else
        db_item.type = 'GearItem'
      end
    end

    def set_armor_info(db_item, item_result)
      db_item.armor_category = item_result[:armor_category]
      db_item.armor_class = ArmorClass.create(
        ac_base: item_result[:armor_class][:base],
        has_dex_bonus: item_result[:armor_class][:dex_bonus],
        max_dex_bonus: item_result[:armor_class][:max_bonus]
      ) unless item_result[:armor_class].nil?
      db_item.stealth_disadvantage = item_result[:stealth_disadvantage]
      db_item.str_minimum = item_result[:str_minimum]
    end

    def set_contents(db_item, item_result)
      unless item_result[:contents].nil? || item_result[:contents].count == 0
        item_result[:contents].each do |item|
          db_item.content_items.create(index: item[:item][:index],
                                       name: item[:item][:name],
                                       quantity: item[:quantity])
        end
      end
    end

    def set_weapon_info(db_item, item_result)
      db_item.category_range = item_result[:category_range]
      db_item.damage = Damage.create(
        damage_dice: item_result[:damage][:damage_dice],
        damage_type: item_result[:damage][:damage_type][:index]
      ) unless item_result[:damage].nil?
      db_item.two_handed_damage = TwoHandedDamage.create(
        damage_dice: item_result[:two_handed_damage][:damage_dice],
        damage_type: item_result[:two_handed_damage][:damage_type][:index]
      ) unless item_result[:two_handed_damage].nil?
      unless item_result[:properties].nil?
        item_result[:properties].each do |prop|
          db_item.properties |= [prop[:name]]
        end
      end
      db_item.item_range = ItemRange.create(
        long: item_result[:range][:long],
        normal: item_result[:range][:normal]
      ) unless item_result[:range].nil?
      db_item.item_throw_range = ItemThrowRange.create(
        long: item_result[:throw_range][:long],
        normal: item_result[:throw_range][:normal]
      ) unless item_result[:throw_range].nil?
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