# frozen_string_literal: true

# Imports from SRD APIs
# Order:
# - `rails srd:import_classes`
# - `rails srd:import_proficiencies`
# - `rails srd:set_prof_choices_for_class`
# - `rails srd:import_monsters`
# - `rails srd:import_spells`
# - `rails srd:import_magic_items`
# - `rails srd:fix_combined_magic_items`
# - `rails srd:import_items`

namespace :srd do
  dnd_api_url = 'http://www.dnd5eapi.co'
  dnd_open5e_url = 'https://api.open5e.com/'

  task import_proficiencies: :environment do
    uri = URI("#{dnd_api_url}/api/proficiencies")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |prof|
      prof_uri = URI("#{dnd_api_url}#{prof[:url]}")
      prof_response = Net::HTTP.get(prof_uri)
      prof_result = JSON.parse prof_response, symbolize_names: true
      Prof.find_or_create_by(name: prof[:name]) do |new_prof|
        new_prof.prof_type = prof_result[:type]
        prof_result[:classes].each do |dnd_class|
          prof_class = DndClass.find_by(name: dnd_class[:name])
          prof_class.profs << new_prof
        end
      end
      count += 1
    end
    puts "#{count} Proficiencies imported."
  end

  task import_classes: :environment do
    uri = URI("#{dnd_api_url}/api/classes")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |dnd_class|
      class_uri = URI("#{dnd_api_url}#{dnd_class[:url]}")
      class_response = Net::HTTP.get(class_uri)
      class_result = JSON.parse class_response, symbolize_names: true
      DndClass.find_or_create_by(name: dnd_class[:name], slug: dnd_class[:name].parameterize) do |new_class|
        new_class.api_url = class_result[:url]
        new_class.hit_die = class_result[:hit_die]
        class_result[:proficiency_choices].each_with_index do |prof_choice_block, index|
          new_class.prof_choices << ProfChoice.find_or_create_by(name: "#{new_class.name} #{index}") do |new_prof_choice|
            new_prof_choice.num_choices = prof_choice_block[:choose]
            new_prof_choice.prof_choice_type = prof_choice_block[:type]
            prof_choice_block[:from].each do |prof|
              new_prof = Prof.find_by(name: prof[:name])
              new_prof_choice.profs << new_prof
            end
          end
        end
        class_result[:proficiencies].each do |prof|
          new_prof = Prof.find_by(name: prof[:name])
          new_class.profs << new_prof
        end
      end
      count += 1
    end
    puts "#{count} D&D classes imported."
  end

  task import_monsters: :environment do
    next_uri = URI("#{dnd_open5e_url}monsters/")
    count = 0
    while next_uri
      response = Net::HTTP.get(next_uri)
      result = JSON.parse response, symbolize_names: true
      next_uri = result[:next] ? URI(result[:next]) : false
      result[:results].each do |monster|
        new_monster = Monster.find_or_create_by(name: monster[:name])
        new_monster.slug = new_monster.slug || monster[:slug]
        new_monster.alignment = monster[:alignment]
        new_monster.api_url = "#{dnd_open5e_url}monsters/#{monster[:slug]}"
        new_monster.challenge_rating = monster[:challenge_rating]
        new_monster.charisma_save = monster[:charisma_save]
        new_monster.condition_immunities = monster[:condition_immunities]
        new_monster.constitution_save = monster[:constitution_save]
        new_monster.damage_immunities = monster[:damage_immunities]
        new_monster.damage_resistances = monster[:damage_resistances]
        new_monster.damage_vulnerabilities = monster[:damage_vulnerabilities]
        new_monster.dexterity_save = monster[:dexterity_save]
        new_monster.intelligence_save = monster[:intelligence_save]
        new_monster.languages = monster[:languages]
        new_monster.reactions = monster[:reactions]
        new_monster.senses = monster[:senses]
        new_monster.size = monster[:size]
        new_monster.strength_save = monster[:strength_save]
        new_monster.monster_subtype = monster[:subtype]
        new_monster.monster_type = monster[:type]
        new_monster.wisdom_save = monster[:wisdom_save]

        # Statistics
        new_monster.armor_class = monster[:armor_class]
        new_monster.charisma = monster[:charisma]
        new_monster.constitution = monster[:constitution]
        new_monster.dexterity = monster[:dexterity]
        new_monster.hit_points = monster[:hit_points]
        new_monster.initiative = DndRules.ability_score_modifier(monster[:dexterity])
        new_monster.intelligence = monster[:intelligence]
        new_monster.speed = monster[:speed].map { |key, value| "#{value}ft. #{key}" }.join(', ')
        new_monster.strength = monster[:strength]
        new_monster.wisdom = monster[:wisdom]

        # Parse the Hit Dice String
        # (handling a stupid edge case with the API encoding)
        hit_dice = if monster[:slug] == 'kobold'
                     '2d6 - 2'
                   else
                     monster[:hit_dice]
                   end
        hit_die_values = DndRules.parse_dice_string(hit_dice)
        new_monster.hit_dice_number = hit_die_values[:hit_dice_number]
        new_monster.hit_dice_value = hit_die_values[:hit_dice_value]
        new_monster.hit_dice_modifier = hit_die_values[:hit_dice_modifier]

        # Skills
        new_monster.skills.delete_all
        monster[:skills].each do |skill, value|
          new_skill = Skill.create(
            name: skill,
            score: value
          )
          new_monster.skills << new_skill
        end

        # Monster Actions
        new_monster.monster_actions.delete_all
        if monster[:actions].is_a?(Array)
          monster[:actions].each do |monster_action|
            new_action = MonsterAction.new(
              name: monster_action[:name],
              description: monster_action[:desc],
              attack_bonus: monster_action[:attack_bonus],
              damage_bonus: monster_action[:damage_bonus],
              damage_dice: monster_action[:damage_dice]
            )
            new_monster.monster_actions << new_action
          end
        end

        # Legendary Actions
        new_monster.legendary_description = monster[:legendary_desc]
        new_monster.monster_legendary_actions.delete_all
        if monster[:legendary_actions].is_a?(Array)
          monster[:legendary_actions].each do |monster_action|
            new_action = MonsterLegendaryAction.new(
              name: monster_action[:name],
              description: monster_action[:desc],
              attack_bonus: monster_action[:attack_bonus],
              damage_bonus: monster_action[:damage_bonus],
              damage_dice: monster_action[:damage_dice]
            )
            new_monster.monster_legendary_actions << new_action
          end
        end

        # Special Abilities
        new_monster.monster_special_abilities.delete_all
        if monster[:special_abilities].is_a?(Array)
          monster[:special_abilities].each do |monster_action|
            new_action = MonsterSpecialAbility.new(
              name: monster_action[:name],
              description: monster_action[:desc],
              attack_bonus: monster_action[:attack_bonus],
              damage_bonus: monster_action[:damage_bonus],
              damage_dice: monster_action[:damage_dice]
            )
            new_monster.monster_special_abilities << new_action
          end
        end
        count += 1
      end
    end
    puts "#{count} monsters imported and updated or created."
  end

  task import_spells: :environment do
    uri = URI("#{dnd_api_url}/api/spells")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |spell|
      spell_uri = URI("#{dnd_api_url}#{spell[:url]}")
      spell_response = Net::HTTP.get(spell_uri)
      spell_result = JSON.parse spell_response, symbolize_names: true
      Spell.find_or_create_by(name: spell[:name]) do |new_spell|
        new_spell.api_url = spell_result[:url]
        new_spell.casting_time = spell_result[:casting_time]
        spell_result[:components].each do |component|
          new_spell.components << component
        end
        if spell_result[:desc]
          new_spell.description = ''
          spell_result[:desc].each do |desc_para|
            new_spell.description += "#{desc_para}\n"
          end
        end
        if spell_result[:higher_level]
          new_spell.higher_level = ''
          spell_result[:higher_level].each do |higher_lvl_para|
            new_spell.higher_level += "#{higher_lvl_para}\n"
          end
        end
        new_spell.level = spell_result[:level]
        new_spell.spell_level = new_spell.get_spell_level_text
        new_spell.material = spell_result[:material]
        new_spell.page = spell_result[:page]
        new_spell.range = spell_result[:range]
        new_spell.duration = spell_result[:duration]
        new_spell.ritual = spell_result[:ritual] == 'yes'
        new_spell.concentration = spell_result[:concentration] == 'yes'
        new_spell.school = spell_result[:school][:name]
        spell_result[:classes].each do |dnd_class_name|
          dnd_class = DndClass.find_by(name: dnd_class_name[:name])
          new_spell.dnd_classes << dnd_class if dnd_class
        end

        spell_slug = spell[:name].parameterize.truncate(80, omission: '')
        new_spell.slug = Spell.exists?(slug: spell_slug) ? "#{spell_slug}_#{new_spell.id}" : spell_slug
      end
      count += 1
    end
    puts "#{count} spells imported."
  end

  task import_items: :environment do
    uri = URI("#{dnd_api_url}/api/equipment")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0

    result[:results].each do |equipment_item|
      item_uri = URI("#{dnd_api_url}#{equipment_item[:url]}")
      item_response = Net::HTTP.get(item_uri)
      item_result = JSON.parse item_response
      saved_item = Item.find_or_create_by(name: equipment_item[:name]) do |new_item|
        new_item.api_url = item_result['url']
        new_item.type = case item_result['equipment_category']
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
        new_item.cost_unit = item_result['cost']['unit']
        new_item.cost_value = item_result['cost']['quantity']
        new_item.weight = item_result['weight'] || 0
        new_item.description = ''

        if item_result['desc']
          new_item.description = "Description: \n"
          item_result['desc'].each do |desc_text|
            new_item.description += "#{desc_text}\n"
          end
        end

        if item_result['weapon_category:']
          new_item.sub_category = item_result['weapon_category:']
          new_item.weapon_range = item_result['category_range']
          new_item.weapon_damage_type = item_result['damage']['damage_type']['name']
          new_item.weapon_damage_dice_count = item_result['damage']['dice_count']
          new_item.weapon_damage_dice_value = item_result['damage']['dice_value']
          new_item.weapon_range_normal = item_result['range']['normal']
          new_item.weapon_range_long = item_result['range']['long']

          item_slug = item[:name].parameterize.truncate(80, omission: '')
          new_item.slug = Item.exists?(slug: item_slug) ? "#{item_slug}_#{new_item.id}" : item_slug

          item_result['properties'].each do |item_result_prop|
            new_item.weapon_properties << item_result_prop['name']
          end

          if item_result['throw_range']
            new_item.weapon_thrown_range_normal = item_result['throw_range']['normal']
            new_item.weapon_thrown_range_long = item_result['throw_range']['long']
          end

          if item_result['2h_damage']
            new_item.weapon_2h_damage_type = item_result['2h_damage']['damage_type']['name']
            new_item.weapon_2h_damage_dice_count = item_result['2h_damage']['dice_count']
            new_item.weapon_2h_damage_dice_value = item_result['2h_damage']['dice_value']
          end

          if item_result['special']
            special_description = "Special: \n"
            item_result['special'].each do |special_text|
              special_description += special_text
            end
            new_item.description += "#{special_description}\n"
          end
        elsif item_result['armor_category']
          new_item.sub_category = item_result['armor_category']
          new_item.armor_class = item_result['armor_class']['base']
          new_item.armor_dex_bonus = item_result['armor_class']['dex_bonus']
          new_item.armor_max_bonus = item_result['armor_class']['max_bonus']
          new_item.armor_stealth_disadvantage = item_result['stealth_disadvantage']
          new_item.armor_str_minimum = item_result['str_minimum']

        elsif item_result['gear_category']
          new_item.sub_category = item_result['gear_category']
          item_result['contents']&.each do |next_item|
            content_item = Item.find_by(api_url: next_item['item_url'])
            if content_item
              content_item.quantity = next_item['quantity']
              new_item.contained_items << content_item
            end
          end

        elsif item_result['tool_category']
          new_item.sub_category = item_result['tool_category']

        elsif item_result['vehicle_category']
          new_item.sub_category = item_result['vehicle_category']
          if item_result['speed']
            new_item.vehicle_speed = item_result['speed']['quantity']
            new_item.vehicle_speed_unit = item_result['speed']['unit']
          end
          new_item.vehicle_capacity = item_result['capacity']
        end
      end
      if !saved_item.sub_category || saved_item.sub_category == ''
        if item_result['weapon_category:']
          saved_item.sub_category = item_result['weapon_category:']
          saved_item.save!
        end
      end
      count += 1
    end
    puts "#{count} Items imported."
  end

  task import_magic_items: :environment do
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

  task fix_combined_magic_items: :environment do
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

  task import_and_fix_magic_items: :environment do
    Rake::Task['srd:import_magic_items'].invoke
    Rake::Task['srd:fix_combined_magic_items'].invoke
  end

  task import_all: :environment do
    Rake::Task['srd:import_proficiencies'].invoke
    Rake::Task['srd:import_classes'].invoke
    Rake::Task['srd:import_monsters'].invoke
    Rake::Task['srd:import_spells'].invoke
    Rake::Task['srd:import_items'].invoke
    Rake::Task['srd:import_and_fix_magic_items'].invoke
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
        magic_figure.description = magic_item[:description] + giant_fly.description
        magic_figure.type = magic_item[:type]
        magic_figure.requires_attunement = magic_item[:requires_attunement]
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
        new_magic_item[:description] = original_item.description
        new_magic_item.type = original_item.type
        new_magic_item[:requires_attunement] = original_item.requires_attunement
        new_magic_item[:rarity] = magic_item[:rarity]
        new_magic_item.slug = new_magic_item[:name].parameterize
      end
    end
  end
end
