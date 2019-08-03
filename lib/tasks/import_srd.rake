namespace :srd do
  dnd_api_url = 'http://www.dnd5eapi.co/api/'
  dnd_open5e_url = 'https://api-beta.open5e.com/'
  
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
        prof_choices_array = Array.new
        class_result[:proficiency_choices].each do |prof_choice_block|
          choices_array = []
          prof_choice_block[:from].each do |prof|
            choices_array << prof[:name]
          end
          prof_choices = {
            from: choices_array,
            type: prof_choice_block[:type],
            number_to_choose: prof_choice_block[:choose]
          }
          prof_choices_array << prof_choices
        end
        new_class.proficiency_choices = prof_choices_array
        class_result[:proficiencies].each do |prof|
          new_class.proficiencies << prof[:name]
        end
        class_result[:saving_throws].each do |saving_throw|
          new_class.saving_throws << saving_throw[:name]
        end
      end
      count += 1
    end
    puts "#{count} D&D classes imported."
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
