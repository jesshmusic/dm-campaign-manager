# frozen_string_literal: true

class SrdUtilities
  class << self
    def dnd_api_url
      'http://www.dnd5eapi.co'
    end
    def dnd_open5e_url
      'https://api.open5e.com/'
    end

    def import_all
      import_dependencies
      import_items
      import_classes
      import_races
      import_spells
      import_and_fix_magic_items
      import_monsters
    end

    def import_all_empty
      has_dependencies = AbilityScore.count > 0 && Prof.count > 0 && Condition.count > 0
      import_dependencies unless has_dependencies
      import_items unless Item.count > 0
      import_classes unless DndClass.count > 0
      import_races unless Race.count > 0
      import_spells unless Spell.count > 0
      import_and_fix_magic_items unless Item.count > 0
      import_monsters unless Monster.count > 0
    end

    def import_dependencies
      import_ability_scores
      import_proficiencies
      import_conditions
    end

    def import_dnd_classes
      # import_dependencies
      # import_items
      import_classes
    end

    def clean_database
      AbilityScoreDndClass.destroy_all
      count = AbilityScore.count
      AbilityScore.destroy_all
      puts "All #{count} ability scores deleted"
      Condition.destroy_all
      Equipment.destroy_all

      ApiReference.destroy_all
      count = Race.count
      Race.destroy_all
      puts "All #{count} races deleted"
      count = Monster.count
      Monster.destroy_all
      puts "All #{count} monsters deleted"
      count = Item.count
      Item.destroy_all
      puts "All #{count} items deleted"
      count = MagicItem.count
      MagicItem.destroy_all
      puts "All #{count} magic items deleted"
      count = Spell.count
      Spell.destroy_all
      puts "All #{count} spells deleted"
      count = DndClass.count
      DndClass.destroy_all
      puts "All #{count} classes deleted"
      count = Prof.count
      Prof.destroy_all
      puts "All #{count} proficiencies deleted"
      # import_all
    end

    private

    def import_ability_scores
      uri = URI("#{dnd_api_url}/api/ability-scores")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |ability_ref|
        # First create an ApiReference for usage elsewhere
        ApiReference.find_or_create_by(slug: ability_ref[:index], name: ability_ref[:index], api_url: "")

        # Fetch the full class record
        ability_uri = URI("#{dnd_api_url}#{ability_ref[:url]}")
        ability_response = Net::HTTP.get(ability_uri)
        ability_result = JSON.parse ability_response, symbolize_names: true

        ability_score = AbilityScore.find_or_create_by(name: ability_result[:name],
                                                       slug: ability_result[:index],
                                                       full_name: ability_result[:full_name])
        ability_score.desc = ability_result[:desc]
        ability_score.save!
        count += 1
      end
      puts "#{count} Abilities imported."
    end

    def import_proficiencies
      uri = URI("#{dnd_api_url}/api/proficiencies")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |prof|
        import_prof(prof[:url])
        count += 1
      end
      puts "#{count} Proficiencies imported or updated."
    end

    def import_classes
      uri = URI("#{dnd_api_url}/api/classes")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |dnd_class_ref|
        # First create an ApiReference for usage elsewhere
        ApiReference.find_or_create_by(slug: dnd_class_ref[:index], name: dnd_class_ref[:index], api_url: "/v1/dnd_classes/#{dnd_class_ref[:index]}")

        # Fetch the full class record
        class_uri = URI("#{dnd_api_url}#{dnd_class_ref[:url]}")
        class_response = Net::HTTP.get(class_uri)
        class_result = JSON.parse class_response, symbolize_names: true

        #Create or update the class
        dnd_class = DndClass.find_or_create_by(slug: class_result[:index],
                                               name: class_result[:name],
                                               api_url: "/v1/dnd_classes/#{class_result[:index]}",
                                               hit_die: class_result[:hit_die])
        if class_result[:saving_throws]
          class_result[:saving_throws].each do |saving_throw|
            ability_score = AbilityScore.find_by(slug: saving_throw[:index])
            dnd_class.ability_scores |= [ability_score]
          end
          puts "#{dnd_class.name} - Added #{dnd_class.ability_scores.count} ability scores"
        end

        class_result[:proficiency_choices].each_with_index do |prof_choice_block, index|
          new_prof_choice = ProfChoice.find_or_initialize_by(name: "#{dnd_class.name} #{index}")
          new_prof_choice.num_choices = prof_choice_block[:choose]
          new_prof_choice.prof_choice_type = prof_choice_block[:type]
          prof_choice_block[:from].each do |prof|
            new_prof = import_prof(prof[:url], dnd_class)
            new_prof_choice.profs |= [new_prof]
          end
          dnd_class.prof_choices |= [new_prof_choice]
        end
        puts "#{dnd_class.name} - Added #{dnd_class.prof_choices.count} starting proficiency choices"

        class_result[:proficiencies].each do |prof|
          new_prof = import_prof(prof[:url], dnd_class)
          dnd_class.profs |= [new_prof]
        end
        dnd_class.equipments.destroy_all
        class_result[:starting_equipment].each do |item|
          equip = dnd_class.equipments.create(name: item[:equipment][:name], quantity: item[:quantity])
          db_item = Item.find_by(name: item[:equipment][:name])
          equip.item = db_item
        end
        puts "#{dnd_class.name} - Added #{dnd_class.equipments.count} starting equipment items"

        dnd_class.starting_equipment_options.destroy_all
        class_result[:starting_equipment_options].each do |option|
          starting_equipment_option = dnd_class.starting_equipment_options.create(choose: option[:choose], equipment_type: option[:type])
          starting_equipment_option = create_equipment_option(option, starting_equipment_option)
          starting_equipment_option.save!
        end
        puts "#{dnd_class.name} - Added #{dnd_class.starting_equipment_options.count} starting equipment options"

        if class_result[:subclasses]
          class_result[:subclasses].each do |subclass|
            dnd_class.subclasses |= [subclass[:name]]
          end
          puts "#{dnd_class.name} - Added #{dnd_class.subclasses.count} subclasses"
        end

        dnd_class.multi_classing.destroy unless dnd_class.multi_classing.nil?
        unless class_result[:multi_classing].nil?
          dnd_class.multi_classing = MultiClassing.create()
          unless class_result[:multi_classing][:prerequisites].nil?
            class_result[:multi_classing][:prerequisites].each do |prereq|
              dnd_class.multi_classing.multi_class_prereqs.create(ability_score: prereq[:ability_score][:name],
                                                     minimum_score: prereq[:minimum_score])
            end
            puts "#{dnd_class.name} - Added #{dnd_class.multi_classing.multi_class_prereqs.count} multiclassing prereqs"
          end
          unless class_result[:multi_classing][:proficiencies].nil?
            class_result[:multi_classing][:proficiencies].each do |prof|
              dnd_class.multi_classing.profs << Prof.find_by(name: prof[:name])
            end
            puts "#{dnd_class.name} - Added #{dnd_class.multi_classing.profs.count} multiclassing proficiencies"
          end
          unless class_result[:multi_classing][:proficiency_choices].nil?
            class_result[:multi_classing][:proficiency_choices].each_with_index do |prof_choice, index|
              choices = dnd_class.multi_classing.prof_choices.create(
                name: "#{dnd_class.name} multiclassing #{index}",
                num_choices: prof_choice[:choose],
                prof_choice_type: prof_choice[:type])
              prof_choice[:from].each do |prof|
                choices.profs << Prof.find_by(name: prof[:name])
              end
              choices.save!
            end
            puts "#{dnd_class.name} - Added #{dnd_class.multi_classing.prof_choices.count} multiclassing proficiency choices"
          end
        end

        dnd_class.save!
        count += 1
      end
      puts "#{count} D&D classes imported."
    end

    def create_equipment_option(option, starting_equipment_option)
      option[:from].each do |item|
        if item.class == Hash
          starting_equipment_option = parse_equipment_option(item, starting_equipment_option)
        else
          item_hash = {
            item[0].to_sym => item[1]
          }
          starting_equipment_option = parse_equipment_option(item_hash, starting_equipment_option)
        end
      end
      starting_equipment_option
    end

    def parse_equipment_option(item, starting_equipment_option)
      if item[:equipment]
        equip = starting_equipment_option.equipments.create(name: item[:equipment][:name],
                                 quantity: item[:quantity])
        equip.item = Item.find_by(name: item[:equipment][:name])
        equip.save!
      elsif item[:equipment_option]
        new_equipment_option = starting_equipment_option.equipment_options.create(choose: item[:equipment_option][:choose], equipment_type: item[:equipment_option][:type])
        new_equipment_option = create_equipment_option(item[:equipment_option], new_equipment_option)
        new_equipment_option.save!
      elsif item[:equipment_category]
        starting_equipment_option.equipment_category = item[:equipment_category][:name]
      end
      starting_equipment_option
    end

    def import_races
      uri = URI("#{dnd_api_url}/api/races")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |race|
        race_uri = URI("#{dnd_api_url}#{race[:url]}")
        race_response = Net::HTTP.get(race_uri)
        race_result = JSON.parse race_response, symbolize_names: true
        current_race = Race.find_or_initialize_by(name: race[:name])
        current_race.slug = race_result[:index]
        if race_result[:ability_bonus_options]
          current_race.ability_bonus_options = race_result[:ability_bonus_options][:choose]
          race_result[:ability_bonus_options][:from].each do |bonus_option|
            current_race.ability_bonus_option_choices << "#{bonus_option[:ability_score][:name]}: #{bonus_option[:bonus]}"
          end
        end
        current_race.age = race_result[:age]
        current_race.alignment = race_result[:alignment]
        race_result[:ability_bonuses].each do |bonus|
          current_race.charisma_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "CHA"
          current_race.constitution_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "CON"
          current_race.dexterity_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "DEX"
          current_race.intelligence_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "INT"
          current_race.strength_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "STR"
          current_race.wisdom_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "WIS"
        end
        if race_result[:language_options]
          current_race.starting_languages = race_result[:language_options][:choose]
          race_result[:language_options][:from].each do |option|
            current_race.language_choices << option[:name]
          end
        end
        current_race.language_description = race_result[:language_desc]
        race_result[:languages].each do |language|
          current_race.languages << language[:name]
        end
        current_race.size = race_result[:size]
        current_race.size_description = race_result[:size_description]
        current_race.speed = race_result[:speed]
        current_race.subraces = race_result[:subraces] ? race_result[:subraces] : []
        if race_result[:traits]
          race_result[:traits].each do |trait|
            trait_uri = URI("#{dnd_api_url}#{trait[:url]}")
            trait_response = Net::HTTP.get(trait_uri)
            trait_result = JSON.parse trait_response, symbolize_names: true
            current_race.traits << {
              description: trait_result[:desc],
              name: trait_result[:name],
              proficiencies: trait_result[:proficiencies],
              proficiency_choices: trait_result[:proficiency_choices],
              trait_specific: trait_result[:trait_specific]
            }
          end
        end
        current_race.save!
        count += 1
      end
      puts "#{count} Races imported or updated."
    end

    def import_conditions
      uri = URI("#{dnd_api_url}/api/conditions")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |condition|
        condition_uri = URI("#{dnd_api_url}#{condition[:url]}")
        condition_response = Net::HTTP.get(condition_uri)
        condition_result = JSON.parse condition_response, symbolize_names: true
        new_cond = Condition.find_or_initialize_by(index: condition[:index])
        new_cond.description = condition_result[:desc]
        new_cond.name = condition_result[:name]
        new_cond.index = condition_result[:index]
        new_cond.save!
        count += 1
      end
      puts "#{count} Conditions imported or updated."
    end

    def import_and_fix_magic_items
      import_magic_items
      fix_combined_magic_items
    end

    def import_prof(prof_url, new_dnd_class = nil )
      prof_uri = URI("#{dnd_api_url}#{prof_url}")
      prof_response = Net::HTTP.get(prof_uri)
      prof_result = JSON.parse prof_response, symbolize_names: true
      new_prof = Prof.find_or_initialize_by(name: prof_result[:name])
      new_prof.prof_type = prof_result[:type]
      prof_result[:classes].each do |dnd_class|
        prof_class = new_dnd_class.nil? ? DndClass.find_by(name: dnd_class[:name]) : new_dnd_class
        prof_class.profs |= [new_prof] unless prof_class.nil?
      end
      prof_result[:races].each do |race|
        prof_race = Race.find_by(slug: "race-#{race[:index]}")
        prof_race.profs |= [new_prof] unless prof_race.nil?
      end
      new_prof.save!
      new_prof
    end

    def import_monsters
      next_uri = URI("#{dnd_api_url}/api/monsters/")
      count = 0
      while next_uri
        response = Net::HTTP.get(next_uri)
        result = JSON.parse response, symbolize_names: true
        next_uri = result[:next] ? URI(result[:next]) : false
        result[:results].each do |monster_ref|
          # monster_ref = result[:results].first
          monster_uri = URI("#{dnd_api_url}#{monster_ref[:url]}")
          monster_response = Net::HTTP.get(monster_uri)
          monster = JSON.parse monster_response, symbolize_names: true
          new_monster = Monster.find_or_initialize_by(name: monster[:name])

          # Required Fields
          new_monster.slug = new_monster.slug || monster[:index]
          new_monster.alignment = monster[:alignment] || "unaligned"
          new_monster.challenge_rating = DndRules.cr_num_to_string(monster[:challenge_rating])
          new_monster.monster_type = monster[:type]
          new_monster.save!

          new_monster.api_url = "/v1/monsters/#{new_monster.slug}"
          new_monster.damage_immunities = monster[:damage_immunities]
          new_monster.damage_resistances = monster[:damage_resistances]
          new_monster.damage_vulnerabilities = monster[:damage_vulnerabilities]
          new_monster.languages = monster[:languages]
          new_monster.size = monster[:size]
          new_monster.monster_subtype = monster[:subtype] || ""
          new_monster.speed = {
            burrow: monster[:speed][:burrow] ? monster[:speed][:burrow]: "",
            climb: monster[:speed][:climb] ? monster[:speed][:climb]: "",
            fly: monster[:speed][:fly] ? monster[:speed][:fly]: "",
            hover: monster[:speed][:hover] ? monster[:speed][:hover]: false,
            swim: monster[:speed][:swim] ? monster[:speed][:swim]: "",
            walk: monster[:speed][:walk] ? monster[:speed][:walk]: "",
          }
          new_monster.senses = monster[:senses]

          # Statistics
          new_monster.armor_class = monster[:armor_class]
          new_monster.charisma = monster[:charisma]
          new_monster.constitution = monster[:constitution]
          new_monster.dexterity = monster[:dexterity]
          new_monster.hit_points = monster[:hit_points]
          new_monster.intelligence = monster[:intelligence]
          new_monster.strength = monster[:strength]
          new_monster.wisdom = monster[:wisdom]
          new_monster.hit_dice = monster[:hit_dice] || ""

          # Actions
          new_monster.actions = monster[:actions] || []
          new_monster.legendary_actions = monster[:legendary_actions] || []
          new_monster.special_abilities = monster[:special_abilities] || []
          new_monster.reactions = monster[:reactions] || []

          # Proficiencies
          new_monster.monster_proficiencies.delete_all
          if monster[:proficiencies] && monster[:proficiencies].is_a?(Array)
            monster[:proficiencies].each do |prof|
              new_prof = Prof.find_by(name: prof[:proficiency][:name])
              new_monster_prof = MonsterProficiency.create(
                value: prof[:value]
              )
              new_monster_prof.prof = new_prof
              new_monster.monster_proficiencies << new_monster_prof
            end
          end

          # Condition Immunities
          new_monster.condition_immunities.delete_all
          if monster[:condition_immunities] && monster[:condition_immunities].is_a?(Array)
            monster[:condition_immunities].each do |cond_imm|
              new_cond = Condition.find_by(index: cond_imm[:index])
              new_cond_imm = ConditionImmunity.create()
              new_cond_imm.condition = new_cond
              new_monster.condition_immunities << new_cond_imm
            end
          end

          new_monster.save!
          count += 1
        end
      end
      puts "#{count} monsters imported and updated or created."
    end

    def import_spells
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

    def import_items
      uri = URI("#{dnd_api_url}/api/equipment")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0

      result[:results].each do |equipment_item|
        item_uri = URI("#{dnd_api_url}#{equipment_item[:url]}")
        item_response = Net::HTTP.get(item_uri)
        item_result = JSON.parse item_response, symbolize_names: true
        db_item = Item.find_or_initialize_by(name: equipment_item[:name])
        db_item.api_url = "/v1/items/#{item_result[:index]}"
        db_item.armor_category = item_result[:armor_category]
        db_item.armor_class = item_result[:armor_class]
        db_item.capacity = item_result[:capacity]
        db_item.category_range = item_result[:category_range]
        db_item.contents = item_result[:contents]
        db_item.cost = Cost.create(quantity: item_result[:cost][:quantity], unit: item_result[:cost][:unit]) if item_result[:cost]
        db_item.damage = item_result[:damage]
        db_item.desc = item_result[:desc]
        db_item.equipment_category = item_result[:equipment_category][:name]
        db_item.gear_category = item_result[:gear_category][:name] unless item_result[:gear_category].nil?
        unless item_result[:properties].nil?
          item_result[:properties].each do |prop|
            db_item.properties |= [prop[:name]]
          end
        end
        db_item.quantity = item_result[:quantity]
        db_item.range = item_result[:range]
        db_item.slug = item_result[:index]
        db_item.special = item_result[:special]
        db_item.speed = item_result[:speed]
        db_item.stealth_disadvantage = item_result[:stealth_disadvantage]
        db_item.str_minimum = item_result[:str_minimum]
        db_item.throw_range = item_result[:throw_range]
        db_item.tool_category = item_result[:tool_category]
        db_item.two_handed_damage = item_result[:two_handed_damage]
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
        db_item.vehicle_category = item_result[:vehicle_category]
        db_item.weapon_category = item_result[:weapon_category]
        db_item.weapon_range = item_result[:weapon_range]
        db_item.weight = item_result[:weight] || 0
        db_item.save!
        count += 1
      end
      puts "#{count} Items imported."
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
end
