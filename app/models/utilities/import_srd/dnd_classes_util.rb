class DndClassesUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import
      uri = URI("#{dnd_api_url}/api/classes")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |dnd_class_ref|
        # Fetch the full class record
        class_uri = URI("#{dnd_api_url}#{dnd_class_ref[:url]}")
        class_response = Net::HTTP.get(class_uri)
        class_result = JSON.parse class_response, symbolize_names: true

        #Create or update the class
        dnd_class = DndClass.find_or_create_by(name: class_result[:name],
                                               api_url: "/v1/dnd_classes/#{class_result[:index]}",
                                               hit_die: class_result[:hit_die])
        # Saving Throws
        import_saving_throws(dnd_class, class_result)

        # Proficiency Choices
        import_prof_choices(dnd_class, class_result)

        # Proficiencies
        import_profs(dnd_class, class_result)

        # Starting Equipment
        import_starting_equipment(dnd_class, class_result)

        # Starting Equipment Options
        import_starting_equip_options(dnd_class, class_result)

        # Subclasses
        import_subclasses(dnd_class, class_result)

        # Multi-classing
        import_multi_classing(dnd_class, class_result)

        # Spell Casting
        import_spell_casting(dnd_class, class_result)

        # Levels
        import_class_levels(dnd_class, class_result)

        # Save and increment count
        dnd_class.save!
        puts "\tClass #{dnd_class.name} imported"
        count += 1
      end
      puts "#{count} D&D classes imported."
    end

    def import_saving_throws(dnd_class, class_result)
      if class_result[:saving_throws]
        class_result[:saving_throws].each do |saving_throw|
          ability_score = AbilityScore.friendly.find(saving_throw[:index])
          dnd_class.ability_scores << ability_score
        end
      end
    end

    def import_prof_choices(dnd_class, class_result)
      class_result[:proficiency_choices].each_with_index do |prof_choice_block, index|
        new_prof_choice = ProfChoice.find_or_initialize_by(name: "#{dnd_class.name} #{index}")
        new_prof_choice.num_choices = prof_choice_block[:choose]
        new_prof_choice.prof_choice_type = prof_choice_block[:type]
        prof_choice_block[:from].each do |prof|
          new_prof = Prof.friendly.find(prof[:index])
          new_prof_choice.profs << new_prof
        end
        dnd_class.prof_choices << new_prof_choice
      end
    end

    def import_profs(dnd_class, class_result)
      class_result[:proficiencies].each do |prof|
        new_prof = Prof.friendly.find(prof[:index])
        dnd_class.profs << new_prof
      end
    end

    def import_starting_equipment(dnd_class, class_result)
      dnd_class.equipments.destroy_all
      class_result[:starting_equipment].each do |item|
        dnd_class.equipments.create(name: item[:equipment][:name], quantity: item[:quantity])
      end
    end

    def import_starting_equip_options(dnd_class, class_result)
      dnd_class.starting_equipment_options.destroy_all
      class_result[:starting_equipment_options].each do |option|
        starting_equipment_option = dnd_class.starting_equipment_options.create(choose: option[:choose], equipment_type: option[:type])
        starting_equipment_option = create_equipment_option(option, starting_equipment_option)
        starting_equipment_option.save!
      end
    end

    def import_subclasses(dnd_class, class_result)
      if class_result[:subclasses]
        class_result[:subclasses].each do |subclass|
          dnd_class.subclasses << subclass[:name]
        end
        dnd_class.subclasses.uniq!
      end
    end

    def import_multi_classing(dnd_class, class_result)
      dnd_class.multi_classing.destroy unless dnd_class.multi_classing.nil?
      unless class_result[:multi_classing].nil?
        dnd_class.multi_classing = MultiClassing.create()
        unless class_result[:multi_classing][:prerequisites].nil?
          class_result[:multi_classing][:prerequisites].each do |prereq|
            dnd_class.multi_classing.multi_class_prereqs.create(ability_score: prereq[:ability_score][:name],
                                                                minimum_score: prereq[:minimum_score])
          end
        end
        unless class_result[:multi_classing][:proficiencies].nil?
          class_result[:multi_classing][:proficiencies].each do |prof|
            dnd_class.multi_classing.profs << Prof.find_by(name: prof[:name])
          end
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
        end
      end
    end

    def import_spell_casting(dnd_class, class_result)
      dnd_class.spell_casting.destroy unless dnd_class.spell_casting.nil?
      unless class_result[:spellcasting].nil?
        spellcasting = class_result[:spellcasting]
        dnd_class.spell_casting = SpellCasting.create(level: spellcasting[:level])
        spellcasting[:info].each do |info|
          dnd_class.spell_casting.spell_casting_infos << SpellCastingInfo.create(name: info[:name], desc: info[:desc])
        end
        dnd_class.spell_casting.ability_score = AbilityScore.friendly.find(spellcasting[:spellcasting_ability][:index])
      end
    end

    def import_class_levels (dnd_class, class_result)
      dnd_class.dnd_class_levels.destroy_all
      class_levels_uri = URI("#{dnd_api_url}#{class_result[:class_levels]}")
      class_levels_response = Net::HTTP.get(class_levels_uri)
      class_levels_result = JSON.parse class_levels_response, symbolize_names: true
      class_levels_result.each do |level|
        if level[:subclass].nil?
          class_level = dnd_class.dnd_class_levels.create(level: level[:level],
                                                          ability_score_bonuses: level[:ability_score_bonuses],
                                                          prof_bonus: level[:prof_bonus])
          import_class_features(class_level, level)

          import_class_spellcasting(class_level, level)

          import_class_specific(class_level, level)

          class_level.save!
        end
      end
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

    def import_class_features(class_level, level)
      level[:features].each do |feature|
        feat_uri = URI("#{dnd_api_url}#{feature[:url]}")
        feat_response = Net::HTTP.get(feat_uri)
        feat_result = JSON.parse feat_response, symbolize_names: true
        class_feat = class_level.class_features.find_or_create_by(name: feat_result[:name], level: feat_result[:level])
        class_feat.desc = feat_result[:desc]

        if feat_result[:choice]
          class_feat.class_level_choice = ClassLevelChoice.create(name: feat_result[:choice][:name], num_choices: feat_result[:choice][:choose])
          feat_result[:choice][:from].each do |option|
            class_feat.class_level_choice.choices << option[:name]
          end
        end

        if feat_result[:prerequisites] && feat_result[:prerequisites].count > 0
          feat_result[:prerequisites].each do |prereq|
            class_feat.prerequisites.find_or_create_by(name: prereq[:type], level: prereq[:level])
          end
        end

        if feat_result[:feature_specific]
          if feat_result[:feature_specific][:subfeature_options]
            sub_options = feat_result[:feature_specific][:subfeature_options]
            class_feat.subfeature_options = ClassLevelChoice.create(name: sub_options[:name], num_choices: sub_options[:choose])
            sub_options[:from].each do |option|
              class_feat.subfeature_options.choices << option[:name]
            end
          end
          if feat_result[:feature_specific][:expertise_options]
            expert_options = feat_result[:feature_specific][:expertise_options]
            class_feat.expertise_options = ClassLevelChoice.create(name: expert_options[:name], num_choices: expert_options[:choose])
            expert_options[:from].each do |option|
              class_feat.expertise_options.choices << option[:name]
            end
          end
        end
        class_feat.save!
      end
    end

    def import_class_specific(class_level, level)
      if level[:class_specific]
        level[:class_specific].each_key do |key|
          key_string = key.to_s
          class_spec = class_level.class_specifics.create(name: key_string.titleize, index: key)
          if key == :creating_spell_slots
            slots = level[:class_specific][:creating_spell_slots]
            slots.each do |slot|
              class_spec.class_specific_spell_slots.create(sorcery_point_cost: slot[:sorcery_point_cost],
                                                           spell_slot_level: slot[:spell_slot_level])
            end
          elsif key == :martial_arts
            martial = level[:class_specific][:martial_arts]
            class_spec.value = "#{martial[:dice_count]}d#{martial[:dice_value]}"
          elsif key == :sneak_attack
            sneak_attack = level[:class_specific][:sneak_attack]
            class_spec.value = "#{sneak_attack[:dice_count]}d#{sneak_attack[:dice_value]}"
          else
            class_spec.value = level[:class_specific][key]
          end
          class_spec.save!
        end
      end
    end

    def import_class_spellcasting(class_level, level)
      if level[:spellcasting]
        spells = level[:spellcasting]
        class_level.class_spellcasting = ClassSpellcasting.create(cantrips_known: spells[:cantrips_known],
                                                                  spells_known: spells[:spells_known],
                                                                  spell_slots_level_1: spells[:spell_slots_level_1],
                                                                  spell_slots_level_2: spells[:spell_slots_level_2],
                                                                  spell_slots_level_3: spells[:spell_slots_level_3],
                                                                  spell_slots_level_4: spells[:spell_slots_level_4],
                                                                  spell_slots_level_5: spells[:spell_slots_level_5],
                                                                  spell_slots_level_6: spells[:spell_slots_level_6],
                                                                  spell_slots_level_7: spells[:spell_slots_level_7],
                                                                  spell_slots_level_8: spells[:spell_slots_level_8],
                                                                  spell_slots_level_9: spells[:spell_slots_level_9])
      end
    end

    def parse_equipment_option(item, starting_equipment_option)
      if item[:equipment]
        equip = starting_equipment_option.equipments.create(name: item[:equipment][:name],
                                                            quantity: item[:quantity])
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
  end
end