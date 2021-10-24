class MagicItemsUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import
      import_magic_items
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
            MagicArmorItem.create_magic_armor_from_old_magic_items(magic_item)
          elsif magic_item[:type].include? 'Weapon'
            MagicWeaponItem.create_magic_weapon_from_old_magic_items(magic_item)
          else
            MagicItem.create_magic_item_from_old_magic_items(magic_item)
          end
          puts "\t Magic Item #{magic_item[:name]} imported."
          count += 1
        end
      end
      create_armors
      fix_combined_magic_items
      puts "#{count} Magic Items imported."
    end

    def fix_combined_magic_items
      combined_magic_items = MagicItem.where.not(rarity: ['common', 'uncommon', 'rare', 'very rare', 'legendary', 'artifact'])
      combined_magic_items.each do |magic_item|
        magic_item_name = magic_item[:name]
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

    def create_armors
      bonuses = [
        { bonus: '+1', rarity: 'rare' },
        { bonus: '+2', rarity: 'very rare' },
        { bonus: '+3', rarity: 'legendary' }
      ]
      bonuses.each do |bonus|
        armor_names = MagicArmorItem.basic_armors
        armor_names.each do |armor_name|
          new_armor_name = "#{armor_name} #{bonus[:bonus]}"
          new_magic_item = MagicItem.find_or_create_by!(name: new_armor_name, slug: "#{new_armor_name.parameterize}-temp") do |new_armor|
            new_armor.desc = ["You have a #{bonus[:bonus]} to AC while wearing this armor."]
            new_armor.requires_attunement = ''
            new_armor.rarity = bonus[:rarity]
          end
          new_magic_item.save!

          MagicArmorItem.new_magic_armor(new_magic_item, armor_name)
          new_magic_item.destroy!
        end
      end
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
          new_magic_item.rarity = original_item.rarity
          new_magic_item.slug = new_magic_item[:name].parameterize
        end
      end
    end
  end
end