namespace :srd do
  dnd_api_url = 'http://www.dnd5eapi.co/api/'
  dnd_open5e_url = 'https://api-beta.open5e.com/'
  
  task import_proficiencies: :environment do
    uri = URI("#{dnd_api_url}proficiencies")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |prof|
      prof_uri = URI(prof[:url])
      prof_response = Net::HTTP.get(prof_uri)
      prof_result = JSON.parse prof_response, symbolize_names: true
      Prof.find_or_create_by(name: prof[:name]) do |new_prof|
        new_prof.prof_type = prof_result[:type]
        prof_result[:classes].each do  |dnd_class|
          prof_class = DndClass.find_by(name: dnd_class[:name])
          prof_class.profs << new_prof
        end
      end
      count += 1
    end
    puts "#{count} D&D classes imported."
  end
  
  task set_prof_choices_for_class: :environment do
    DndClass.where(user_id: nil).each do |dnd_class|
      dnd_class.prof_choices.delete_all
      class_uri = URI(dnd_class.api_url)
      class_response = Net::HTTP.get(class_uri)
      class_result = JSON.parse class_response, symbolize_names: true
      class_result[:proficiency_choices].each_with_index do |prof_choice_block, index|
        prof_choice = ProfChoice.create(
          name: "#{dnd_class.name} #{index}",
          num_choices: prof_choice_block[:choose],
          prof_choice_type: prof_choice_block[:type]
        )
        prof_choice_block[:from].each do |prof|
          new_prof = Prof.find_by(name: prof[:name])
          prof_choice.profs << new_prof
        end
        dnd_class.prof_choices << prof_choice
      end
      dnd_class.save!
    end
  end
  
  task import_classes: :environment do
    uri = URI("#{dnd_api_url}classes")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |dnd_class|
      class_uri = URI(dnd_class[:url])
      class_response = Net::HTTP.get(class_uri)
      class_result = JSON.parse class_response, symbolize_names: true
      DndClass.find_or_create_by(name: dnd_class[:name]) do |new_class|
        new_class.api_url = class_result[:url]
        new_class.hit_die = class_result[:hit_die]
        new_class_slug = dnd_class[:name].parameterize.truncate(80, omission: '')
        new_class.slug = DndClass.exists?(slug: new_class_slug) ? "#{new_class_slug}_#{new_class.id}" : new_class_slug
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
        new_monster.slug = new_monster.slug ? new_monster.slug : monster[:slug]
        new_monster.alignment = monster[:alignment]
        new_monster.api_url = "#{dnd_open5e_url}monsters/#{monster[:slug]}"
        new_monster.armor_class = monster[:armor_class]
        new_monster.challenge_rating = monster[:challenge_rating]
        new_monster.charisma = monster[:charisma]
        new_monster.charisma_save = monster[:charisma_save]
        new_monster.condition_immunities = monster[:condition_immunities]
        new_monster.constitution = monster[:constitution]
        new_monster.constitution_save = monster[:constitution_save]
        new_monster.damage_immunities = monster[:damage_immunities]
        new_monster.damage_resistances = monster[:damage_resistances]
        new_monster.damage_vulnerabilities = monster[:damage_vulnerabilities]
        new_monster.dexterity = monster[:dexterity]
        new_monster.dexterity_save = monster[:dexterity_save]
        new_monster.hit_dice = monster[:hit_dice]
        new_monster.hit_points = monster[:hit_points]
        new_monster.intelligence = monster[:intelligence]
        new_monster.intelligence_save = monster[:intelligence_save]
        new_monster.languages = monster[:languages]
        new_monster.reactions = monster[:reactions]
        new_monster.senses = monster[:senses]
        new_monster.size  = monster[:size]
        new_monster.skills.delete_all
        monster[:skills].each do |skill, value|
          new_skill = Skill.create(
            name: skill,
            score: value
          )
          new_monster.skills << new_skill
        end
        new_monster.speed = monster[:speed].map { |key, value| "#{value}ft. #{key}"}.join(', ')
        new_monster.strength = monster[:strength]
        new_monster.strength_save = monster[:strength_save]
        new_monster.monster_subtype = monster[:subtype]
        new_monster.monster_type = monster[:type]
        new_monster.wisdom = monster[:wisdom]
        new_monster.wisdom_save = monster[:wisdom_save]
        
        new_monster.monster_actions.delete_all
        if monster[:actions].kind_of?(Array)
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
        
        new_monster.legendary_description = monster[:legendary_desc]
        new_monster.monster_legendary_actions.delete_all
        if monster[:legendary_actions].kind_of?(Array)
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
        
        new_monster.monster_special_abilities.delete_all
        if monster[:special_abilities].kind_of?(Array)
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
    uri = URI("#{dnd_api_url}spells")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |spell|
      spell_uri = URI(spell[:url])
      spell_response = Net::HTTP.get(spell_uri)
      spell_result = JSON.parse spell_response, symbolize_names: true
      Spell.find_or_create_by(name: spell[:name]) do |new_spell|
        new_spell.api_url = spell_result[:url]
        new_spell.casting_time = spell_result[:casting_time]
        spell_result[:components].each do |component|
          new_spell.components << component
        end
        if spell_result[:desc]
          new_spell.description = ""
          spell_result[:desc].each do |desc_para|
            new_spell.description += "#{desc_para}\n"
          end
        end
        if spell_result[:higher_level]
          new_spell.higher_level = ""
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
        new_spell.ritual = spell_result[:ritual] == "yes"
        new_spell.concentration = spell_result[:concentration] == "yes"
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
  
  task import_magic_items: :environment do
    next_uri = URI("#{dnd_open5e_url}magicitems/")
    count = 0
    while next_uri
      response = Net::HTTP.get(next_uri)
      result = JSON.parse response, symbolize_names: true
      next_uri = result[:next] ? URI(result[:next]) : false
      result[:results].each do |magic_item|
        MagicItem.find_or_create_by(name: magic_item[:name], rarity: magic_item[:rarity]) do |new_magic_item|
          new_magic_item.description = magic_item[:desc]
          new_magic_item.magic_item_type = magic_item[:type]
          new_magic_item.requires_attunement = magic_item[:requires_attunement]
          
          magic_item_slug = magic_item[:name].parameterize.truncate(80, omission: '')
          new_magic_item.slug = MagicItem.exists?(slug: magic_item_slug) ? "#{magic_item_slug}_#{new_magic_item.id}" : magic_item_slug
          
        end
        count += 1
      end
    end
    puts "#{count} Magic Items imported."
  end
  
  task import_items: :environment do
    uri = URI("#{dnd_api_url}equipment")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0

    result[:results].each do |equipment_item|
      item_uri = URI(equipment_item[:url])
      item_response = Net::HTTP.get(item_uri)
      item_result = JSON.parse item_response
      saved_item = Item.find_or_create_by(name: equipment_item[:name]) do |new_item|
        new_item.api_url = item_result["url"]
        new_item.category = item_result["equipment_category"]
        new_item.cost_unit = item_result["cost"]["unit"]
        new_item.cost_value = item_result["cost"]["quantity"]
        new_item.weight = item_result["weight"] ? item_result["weight"] : 0
        new_item.description = ""
        
        if item_result["desc"]
          new_item.description = "Description: \n"
          item_result["desc"].each do |desc_text|
            new_item.description += "#{desc_text}\n"
          end
        end
      
        if item_result["weapon_category:"]
          new_item.sub_category = item_result["weapon_category:"]
          new_item.weapon_range = item_result["category_range"]
          new_item.weapon_damage_type = item_result["damage"]["damage_type"]["name"]
          new_item.weapon_damage_dice_count = item_result["damage"]["dice_count"]
          new_item.weapon_damage_dice_value = item_result["damage"]["dice_value"]
          new_item.weapon_range_normal = item_result["range"]["normal"]
          new_item.weapon_range_long = item_result["range"]["long"]
          
          item_slug = item[:name].parameterize.truncate(80, omission: '')
          new_item.slug = Item.exists?(slug: item_slug) ? "#{item_slug}_#{new_item.id}" : item_slug
          
          item_result["properties"].each do |item_result_prop|
            new_item.weapon_properties << item_result_prop["name"]
          end
      
          if item_result["throw_range"]
            new_item.weapon_thrown_range_normal = item_result["throw_range"]["normal"]
            new_item.weapon_thrown_range_long = item_result["throw_range"]["long"]
          end
      
          if item_result["2h_damage"]
            new_item.weapon_2h_damage_type = item_result["2h_damage"]["damage_type"]["name"]
            new_item.weapon_2h_damage_dice_count = item_result["2h_damage"]["dice_count"]
            new_item.weapon_2h_damage_dice_value = item_result["2h_damage"]["dice_value"]
          end
          
          if item_result["special"]
            special_description = "Special: \n"
            item_result["special"].each do |special_text|
              special_description += special_text
            end
            new_item.description += "#{special_description}\n"
          end
        elsif item_result["armor_category"]
          new_item.sub_category = item_result["armor_category"]
          new_item.armor_class = item_result["armor_class"]["base"]
          new_item.armor_dex_bonus = item_result["armor_class"]["dex_bonus"]
          new_item.armor_max_bonus = item_result["armor_class"]["max_bonus"]
          new_item.armor_stealth_disadvantage = item_result["stealth_disadvantage"]
          new_item.armor_str_minimum = item_result["str_minimum"]
      
        elsif item_result["gear_category"]
          new_item.sub_category = item_result["gear_category"]
          if item_result["contents"]
            item_result["contents"].each do |next_item|
              content_item = Item.find_by(api_url: next_item["item_url"])
              if content_item
                content_item.quantity = next_item["quantity"]
                new_item.contained_items << content_item
              end
            end
          end
      
        elsif item_result["tool_category"]
          new_item.sub_category = item_result["tool_category"]
      
        elsif item_result["vehicle_category"]
          new_item.sub_category = item_result["vehicle_category"]
          if item_result["speed"]
            new_item.vehicle_speed = item_result["speed"]["quantity"]
            new_item.vehicle_speed_unit = item_result["speed"]["unit"]
          end
          new_item.vehicle_capacity = item_result["capacity"]
        end
      end
      if !saved_item.sub_category || saved_item.sub_category == ""
        if item_result["weapon_category:"]
          saved_item.sub_category = item_result["weapon_category:"]
          saved_item.save!
        end
      end
      count += 1
    end
    puts "#{count} Items imported."
  end
end
