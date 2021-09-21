class ItemsUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import_items
      import_initial_items
      import_and_fix_magic_items
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
        puts "\tCreating Item: #{item_result[:name]}"
        db_item = Item.find_or_create_by!(name: equipment_item[:name])
        set_item_info(db_item, item_result)
        set_equipment_category(db_item, item_result)
        set_armor_info(db_item, item_result)
        set_contents(db_item, item_result)
        set_weapon_info(db_item, item_result)
        set_vehicle_info(db_item, item_result)
        db_item.save!
        puts "\t\tItem saved: #{db_item.name} (\"#{db_item.equipment_category}\")"
        count += 1
      end
      puts "#{count} Items imported."
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

    def set_item_info(db_item, item_result)
      db_item.slug = item_result[:index]
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

    def set_vehicle_info(db_item, item_result)
      db_item.capacity = item_result[:capacity]
      db_item.vehicle_category = item_result[:vehicle_category]
      db_item.speed = "#{item_result[:speed][:quantity]} #{item_result[:speed][:unit]}" unless item_result[:speed].nil?
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

    def import_and_fix_magic_items
      import_magic_items
      fix_combined_magic_items
    end

    def import_magic_items
      next_uri = URI("#{dnd_open5e_url}magicitems/")
      count = 0
      while next_uri
        response = Net::HTTP.get(next_uri)
        result = JSON.parse response, symbolize_names: true
        next_uri = result[:next] ? URI(result[:next]) : false
        result[:results].each do |magic_item|

          if magic_item[:type].include? 'Armor'
            ArmorItem.create_magic_armor_from_old_magic_items(magic_item)
          elsif magic_item[:type].include? 'Weapon'
            WeaponItem.create_magic_weapon_from_old_magic_items(magic_item)
          else
            MagicItem.create_magic_item_from_old_magic_items(magic_item)
          end
          count += 1
        end
      end
      puts "#{count} Magic Items imported."
    end

    def fix_combined_magic_items
      combined_magic_items = MagicItem.where.not(rarity: ['common', 'uncommon', 'rare', 'very rare', 'legendary', 'artifact'])
      combined_magic_items.each do |magic_item|
        magic_item_name = magic_item[:name]
        puts "Splitting #{magic_item_name}"
        case magic_item_name
        when 'Belt of Giant Strength'
          create_belts_of_giant_strength(magic_item)
          magic_item.destroy!
        when 'Figurine of Wondrous Power'
          create_figurines_of_wondrous_power(magic_item)
          magic_item.destroy!
        when 'Ioun Stone'
          create_ioun_stones(magic_item)
          magic_item.destroy!
        when 'Potion of Healing'
          create_potions_of_healing(magic_item)
          magic_item.destroy!
        when 'Wand of the War Mage, +1, +2, or +3'
          create_wands_of_the_war_mage(magic_item)
          magic_item.destroy!
        when 'Weapon, +1, +2, or +3'
          create_weapons(magic_item)
          magic_item.destroy!
        when 'Crystal Ball'
          create_crystal_balls(magic_item)
          magic_item.destroy!
        when 'Horn of Valhalla'
          create_horns_of_valhalla(magic_item)
          magic_item.destroy!
        when 'Potion of Giant Strength'
          create_potions_of_giant_strength(magic_item)
          magic_item.destroy!
        when 'Spell Scroll'
          create_spell_scrolls(magic_item)
          magic_item.destroy!
        end
      end
    end

    def create_belts_of_giant_strength(magic_item)
      belts_of_str = [
        { name: 'Belt of Hill Giant Strength', rarity: 'rare' },
        { name: 'Belt of Stone Giant Strength', rarity: 'very rare' },
        { name: 'Belt of Fire Giant Strength', rarity: 'very rare' },
        { name: 'Belt of Cloud Giant Strength', rarity: 'legendary' },
        { name: 'Belt of Storm Giant Strength', rarity: 'legendary' }
      ]
      create_magic_items(belts_of_str, magic_item)
    end

    def create_figurines_of_wondrous_power(magic_item)
      figurines = [
        { name: 'Figurine of Power, Bronze Griffon', rarity: 'rare' },
        { name: 'Figurine of Power, Ebony Fly', rarity: 'rare' },
        { name: 'Figurine of Power, Golden Lions', rarity: 'rare' },
        { name: 'Figurine of Power, Ivory Goats', rarity: 'rare' },
        { name: 'Figurine of Power, Marble Elephant', rarity: 'rare' },
        { name: 'Figurine of Power, Obsidian Steed', rarity: 'very rare' },
        { name: 'Figurine of Power, Onyx Dog', rarity: 'rare' },
        { name: 'Figurine of Power, Serpentine Owl', rarity: 'rare' },
        { name: 'Figurine of Power, Silver Raven', rarity: 'uncommon' }
      ]
      giant_fly = MagicItem.find_by(name: 'Giant Fly')
      figurines.each do |figurine|
        MagicItem.find_or_create_by!(name: figurine[:name]) do |magic_figure|
          magic_figure.desc = magic_item.desc + giant_fly.desc
          magic_figure.magic_item_type = magic_item.magic_item_type
          magic_figure.requires_attunement = magic_item.requires_attunement
          magic_figure.rarity = figurine[:rarity]
          magic_figure.slug = magic_figure.name.parameterize
        end
      end
      giant_fly.destroy!
    end

    def create_ioun_stones(magic_item)
      ioun_stones = [
        { name: 'Ioun Stone, Absorption', rarity: 'very rare' },
        { name: 'Ioun Stone, Agility', rarity: 'very rare' },
        { name: 'Ioun Stone, Awareness', rarity: 'rare' },
        { name: 'Ioun Stone, Fortitude', rarity: 'very rare' },
        { name: 'Ioun Stone, Greater Absorption', rarity: 'legendary' },
        { name: 'Ioun Stone, Insight', rarity: 'very rare' },
        { name: 'Ioun Stone, Intellect', rarity: 'very rare' },
        { name: 'Ioun Stone, Leadership', rarity: 'very rare' },
        { name: 'Ioun Stone, Mastery', rarity: 'legendary' },
        { name: 'Ioun Stone, Protection', rarity: 'rare' },
        { name: 'Ioun Stone, Regeneration', rarity: 'legendary' },
        { name: 'Ioun Stone, Reserve', rarity: 'rare' },
        { name: 'Ioun Stone, Strength', rarity: 'very rare' },
        { name: 'Ioun Stone, Sustenance', rarity: 'rare' }
      ]
      create_magic_items(ioun_stones, magic_item)
    end

    def create_potions_of_healing(magic_item)
      potions = [
        { name: 'Potion of Healing, Common', rarity: 'common' },
        { name: 'Potion of Greater Healing', rarity: 'uncommon' },
        { name: 'Potion of Superior Healing', rarity: 'rare' },
        { name: 'Potion of Supreme Healing', rarity: 'very rare' }
      ]
      create_magic_items(potions, magic_item)
    end

    def create_wands_of_the_war_mage(magic_item)
      wands = [
        { name: 'Wand of the War Mage +1', rarity: 'uncommon' },
        { name: 'Wand of the War Mage +2', rarity: 'rare' },
        { name: 'Wand of the War Mage +3', rarity: 'very rare' }
      ]
      create_magic_items(wands, magic_item)
    end

    def create_weapons(magic_item)
      bonuses = [
        { bonus: '+1', rarity: 'uncommon' },
        { bonus: '+2', rarity: 'rare' },
        { bonus: '+3', rarity: 'very rare' }
      ]
      weapons = []
      bonuses.each do |bonus|
        weapon_names = Item.where(category: 'Weapon').pluck(:name)
        weapon_names << 'Ammunition'
        weapon_names.each do |weapon_name|
          weapons << {
            name: "#{weapon_name} #{bonus[:bonus]}",
            rarity: bonus[:rarity]
          }
        end
      end
      create_magic_items(weapons, magic_item)
    end

    def create_crystal_balls(magic_item)
      crystal_balls = [
        { name: 'Crystal Ball, typical', rarity: 'very rare' },
        { name: 'Crystal Ball of Mind Reading', rarity: 'legendary' },
        { name: 'Crystal Ball of Telepathy', rarity: 'legendary' },
        { name: 'Crystal Ball of True Seeing', rarity: 'legendary' }
      ]
      create_magic_items(crystal_balls, magic_item)
    end

    def create_horns_of_valhalla(magic_item)
      horns = [
        { name: 'Horn of Valhalla, Silver', rarity: 'rare' },
        { name: 'Horn of Valhalla, Brass', rarity: 'rare' },
        { name: 'Horn of Valhalla, Bronze', rarity: 'very rare' },
        { name: 'Horn of Valhalla, Iron', rarity: 'legendary' }
      ]
      create_magic_items(horns, magic_item)
    end

    def create_potions_of_giant_strength(magic_item)
      potions = [
        { name: 'Potion of Hill Giant Strength', rarity: 'uncommon' },
        { name: 'Potion of Stone Giant Strength', rarity: 'rare' },
        { name: 'Potion of Fire Giant Strength', rarity: 'rare' },
        { name: 'Potion of Cloud Giant Strength', rarity: 'very rare' },
        { name: 'Potion of Storm Giant Strength', rarity: 'legendary' }
      ]
      create_magic_items(potions, magic_item)
    end

    def create_spell_scrolls(magic_item)
      scrolls = [
        { name: 'Spell Scroll, Cantrip', rarity: 'common' },
        { name: 'Spell Scroll, 1st Level', rarity: 'common' },
        { name: 'Spell Scroll, 2nd Level', rarity: 'uncommon' },
        { name: 'Spell Scroll, 3rd Level', rarity: 'uncommon' },
        { name: 'Spell Scroll, 4th Level', rarity: 'rare' },
        { name: 'Spell Scroll, 5th Level', rarity: 'rare' },
        { name: 'Spell Scroll, 6th Level', rarity: 'very rare' },
        { name: 'Spell Scroll, 7th Level', rarity: 'very rare' },
        { name: 'Spell Scroll, 8th Level', rarity: 'very rare' },
        { name: 'Spell Scroll, 9th Level', rarity: 'legendary' }
      ]
      create_magic_items(scrolls, magic_item)
    end

    def create_magic_items(magic_items, original_item)
      magic_items.each do |magic_item|
        MagicItem.find_or_create_by!(name: magic_item[:name]) do |new_magic_item|
          new_magic_item.desc = original_item.desc
          new_magic_item.type = original_item.type
          new_magic_item.requires_attunement = original_item.requires_attunement
          new_magic_item.rarity = magic_item[:rarity]
          new_magic_item.slug = new_magic_item[:name].parameterize
        end
      end
    end
  end
end