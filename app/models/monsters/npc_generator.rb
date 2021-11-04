# frozen_string_literal: true

class NpcGenerator
  class << self

    def generate_npc(monster_params, user)
      Monster.new(monster_params)
    end

    def convert_2e_npc(npc_attributes)
      @new_npc = Monster.new(name: npc_attributes[:name],
                             size: 'Medium',
                             alignment: npc_attributes[:alignment],
                             monster_type: 'humanoid',
                             strength: npc_attributes[:strength],
                             dexterity: npc_attributes[:dexterity],
                             constitution: npc_attributes[:constitution],
                             intelligence: npc_attributes[:intelligence],
                             wisdom: npc_attributes[:wisdom],
                             charisma: npc_attributes[:charisma])

      @new_npc.monster_subtype = npc_attributes[:race]

      convert_2e_stats(npc_attributes)

      # Race
      set_npc_race(npc_attributes[:monster_subtype])

      # Spellcasting
      spell_attack, spell_save_dc, spellcasting_ability, spellcasting_level = spellcasting_for_class(npc_attributes)
      create_spells_trait(npc_attributes, spell_attack, spell_save_dc, spellcasting_ability, spellcasting_level)

      # Add Actions
      create_actions(npc_attributes[:actions], npc_attributes[:number_of_attacks].to_i, @new_npc.challenge_rating.to_sym)

      # Return
      @new_npc.as_json(
        include: %i[monster_actions monster_legendary_actions monster_special_abilities skills],
        methods: %i[description_text hit_dice size_and_type saving_throws skills_string xp])
    end

    def generate_commoner(random_npc_gender, random_npc_race)
      commoner = Monster.where(name: 'Commoner').first
      @new_npc = Monster.new commoner.attributes
      @new_npc.challenge_rating = %w[0 0 0 0 0 1/8 1/8 1/8 1/4 1/4 1/2].sample
      ability_score_order = %w[Strength Dexterity Constitution Intelligence Wisdom Charisma].shuffle
      set_ability_scores(ability_score_order, 8)
      @new_npc.name = NameGen.random_name(random_npc_gender, random_npc_race)
      @new_npc.monster_subtype = random_npc_race

      # Other statistics
      @new_npc.armor_class = @new_npc.armor_class + DndRules.ability_score_modifier(@new_npc.dexterity)
      @new_npc.alignment = DndRules.alignments_non_evil.sample
      @new_npc.hit_points += DndRules.ability_score_modifier(@new_npc.constitution)
      @new_npc
    end

    def calculate_cr(params)
      monster = params[:params][:monster]
      attack_bonus = monster[:attack_bonus]
      challenge_rating = DndRules.cr_for_npc(monster, attack_bonus)
      cr_data = DndRules.challenge_ratings[challenge_rating.to_sym].as_json
      { name: challenge_rating, data: cr_data }
    end

    private

    def spellcasting_for_class(npc_attributes)
      spellcasting_classes = npc_attributes[:dnd_classes].select { |dnd_class|
        dnd_class_name = dnd_class[:dnd_class][:label]
        dnd_class_name == 'Bard' || dnd_class_name == 'Cleric' || dnd_class_name == 'Druid' ||
          dnd_class_name == 'Sorcerer' || dnd_class_name == 'Wizard' || dnd_class_name == 'Paladin' ||
          dnd_class_name == 'Ranger' || dnd_class_name == 'Warlock'
      }
      spellcasting_class = spellcasting_classes.max_by do |dnd_class|
        dnd_class[:level].to_i
      end
      spell_class = DndClass.find(spellcasting_class[:dnd_class][:value])
      prof_bonus = DndRules.proficiency_bonus_for_level(spellcasting_class[:level].to_i)
      spell_attack = DndRules.spell_attack_bonus(prof_bonus, spell_class, @new_npc)
      spell_save_dc = DndRules.challenge_ratings[spellcasting_class[:level].to_sym][:save_dc]
      spellcasting_ability = if spellcasting_class[:dnd_class][:label] == 'Wizard'
                               'Intelligence'
                             elsif spellcasting_class[:dnd_class][:label] == 'Cleric' ||
                               spellcasting_class[:dnd_class][:label] == 'Druid' ||
                               spellcasting_class[:dnd_class][:label] == 'Ranger'
                               'Wisdom'
                             else
                               'Charisma'
                             end
      spellcasting_level = "#{spellcasting_class[:level].to_i.ordinalize}-level"
      [spell_attack, spell_save_dc, spellcasting_ability, spellcasting_level]
    end

    def set_npc_race(race_string)
      unless race_string.blank?
        race_name = DndRules.race_values[race_string.to_sym]
        @npc_race = Race.where(name: race_name).first
      end
    end

    def set_npc_hit_points
      con_modifier = DndRules.ability_score_modifier(@new_npc.constitution)
      hit_points_info = DndRules.calculate_hp_and_hd(@new_npc.size, @new_npc.challenge_rating, con_modifier)
      npc_atts = @new_npc.attributes
      @new_npc.hit_dice = "d#{hit_points_info[:num_hit_die]}"
      @new_npc.hit_points = hit_points_info[:hit_points]
      DndRules.challenge_ratings[@new_npc.challenge_rating.to_sym]
    end

    # Spellcasting

    def parse_spells_action(atts)
      puts atts[:npc_variant] == 'caster_wizard' || atts[:npc_variant] == 'caster_cleric'
      if atts[:npc_variant] == 'caster_wizard' || atts[:npc_variant] == 'caster_cleric'
        spell_attack, spell_save_dc, spellcaster_ability, spellcasting_level = get_spellcasting_stats(atts)
        create_spells_trait(atts, spell_attack, spell_save_dc, spellcaster_ability, spellcasting_level)
      end
    end

    def create_spells_trait(atts, spell_attack, spell_save_dc, spellcaster_ability, spellcasting_level)
      spellcasting_ability = MonsterSpecialAbility.new(
        name: 'Spellcasting'
      )
      spell_desc = ["The #{@new_npc.name} is a #{spellcasting_level} spellcaster. Its spellcasting ability is #{spellcaster_ability} (spell save DC #{spell_save_dc}, +#{spell_attack} to hit with spell attacks). #{@new_npc.name} has the following spells prepared.\n\n"]
      if atts[:spells_cantrips]
        spell_desc << "Cantrips (at will): #{atts[:spells_cantrips].join(', ')}\n"
      end
      if atts[:spells_level1]
        spell_desc << "1st level (#{atts[:spells_level1].length} slots): #{atts[:spells_level1].join(', ')}\n"
      end
      if atts[:spells_level2]
        spell_desc << "2nd level (#{atts[:spells_level2].length} slots): #{atts[:spells_level2].join(', ')}\n"
      end
      if atts[:spells_level3]
        spell_desc << "3rd level (#{atts[:spells_level3].length} slots): #{atts[:spells_level3].join(', ')}\n"
      end
      if atts[:spells_level4]
        spell_desc << "4th level (#{atts[:spells_level4].length} slots): #{atts[:spells_level4].join(', ')}\n"
      end
      if atts[:spells_level5]
        spell_desc << "5th level (#{atts[:spells_level5].length} slots): #{atts[:spells_level5].join(', ')}\n"
      end
      if atts[:spells_level6]
        spell_desc << "6th level (#{atts[:spells_level6].length} slots): #{atts[:spells_level6].join(', ')}\n"
      end
      if atts[:spells_level7]
        spell_desc << "7th level (#{atts[:spells_level7].length} slots): #{atts[:spells_level7].join(', ')}\n"
      end
      if atts[:spells_level8]
        spell_desc << "8th level (#{atts[:spells_level8].length} slots): #{atts[:spells_level8].join(', ')}\n"
      end
      if atts[:spells_level9]
        spell_desc << "9th level (#{atts[:spells_level9].length} slots): #{atts[:spells_level9].join(', ')}"
      end
      spellcasting_ability.description = spell_desc.join
      @new_npc.monster_special_abilities << spellcasting_ability
    end

    def get_spellcasting_stats(atts)
      spellcasting_level = if @new_npc.challenge_rating == '1' ||
        @new_npc.challenge_rating == '0' ||
        @new_npc.challenge_rating == '1/8' ||
        @new_npc.challenge_rating == '1/4' ||
        @new_npc.challenge_rating == '1/2'
                             "1st-level"
                           elsif @new_npc.challenge_rating == '2'
                             "2nd-level"
                           elsif @new_npc.challenge_rating == '3'
                             "3rd-level"
                           elsif @new_npc.challenge_rating == '21'
                             "21st-level"
                           elsif @new_npc.challenge_rating == '22'
                             "22nd-level"
                           elsif @new_npc.challenge_rating == '23'
                             "23rd-level"
                           else
                             "#{@new_npc.challenge_rating}th-level"
                           end
      spell_save_dc = DndRules.challenge_ratings[@new_npc.challenge_rating.to_sym][:save_dc]
      spell_attack = DndRules.challenge_ratings[@new_npc.challenge_rating.to_sym][:attack_bonus]
      spellcaster_ability = atts[:npc_variant] == 'caster_wizard' ? 'Intelligence' : 'Wisdom'
      [spell_attack, spell_save_dc, spellcaster_ability, spellcasting_level]
    end

    # Statistics

    def set_ability_scores(score_priority = [], min_score = 10)
      ability_scores = Array.new(6)
      ability_scores.each_with_index do |_, index|
        rolls = [DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6)]
        rolls.delete_at(rolls.index(rolls.min))
        ability_scores[index] = rolls.sum
      end
      score_priority.each_with_index do |ability, index|
        set_primary_ability(ability, ability_scores, index, min_score)
      end
    end

    def set_primary_ability(ability, ability_scores, index, min_score)
      min_score_calc = index.zero? ? min_score.to_i : 0
      highest_score = [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max
      case ability
      when 'Strength'
        @new_npc.strength = highest_score
        @new_npc.strength += @npc_race.strength_modifier unless @npc_race.nil?
      when 'Dexterity'
        @new_npc.dexterity = highest_score
        @new_npc.dexterity += @npc_race.dexterity_modifier unless @npc_race.nil?
      when 'Constitution'
        @new_npc.constitution = highest_score
        @new_npc.constitution += @npc_race.constitution_modifier unless @npc_race.nil?
      when 'Intelligence'
        @new_npc.intelligence = highest_score
        @new_npc.intelligence += @npc_race.intelligence_modifier unless @npc_race.nil?
      when 'Wisdom'
        @new_npc.wisdom = highest_score
        @new_npc.wisdom += @npc_race.wisdom_modifier unless @npc_race.nil?
      when 'Charisma'
        @new_npc.charisma = highest_score
        @new_npc.charisma += @npc_race.charisma_modifier unless @npc_race.nil?
      else
        puts "Ability #{ability} not found!"
      end
    end

    # Actions

    def create_actions(actions, number_of_attacks, challenge_rating)
      if actions.length > 0
        if number_of_attacks > 1
          weapon_name = actions.first[:label]
          multi_attack = MonsterAction.new(
            name: 'Multiattack',
            description: "The #{@new_npc.name} makes #{number_of_attacks} #{weapon_name.downcase} attacks."
          )
          @new_npc.monster_actions << multi_attack
        end
        actions.each do |action|
          puts action.inspect
          action_description = ""
          if action[:data][:properties] && action[:data][:properties].include?('Ammunition')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += "Ranged Weapon Attack: +#{DndRules.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " range #{action[:data][:range_normal]}/#{action[:data][:range_long]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage."
          elsif action[:data][:properties] && action[:data][:properties].include?('Versatile')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            base_2h_damage = ((action[:data][:damage_dice2_h_count] * action[:data][:damage_dice2_h_value] + npc_dam_bonus) * 0.55).ceil
            action_description += "Melee Weapon Attack: +#{DndRules.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " reach #{action[:data][:range_normal]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage, "
            action_description += "or #{base_2h_damage} (#{action[:data][:damage_dice2_h_count]}d#{action[:data][:damage_dice2_h_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage if used with two hands."
          else
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += "Melee Weapon Attack: +#{DndRules.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " reach #{action[:data][:range_normal]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage."
          end
          if action[:data][:properties] && action[:data][:properties].include?('Thrown')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += " Or Ranged Weapon Attack: +#{DndRules.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " range #{action[:data][:thrown_range_normal]}/#{action[:data][:thrown_range_long]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage."
          end
          action = MonsterAction.new(
            name: action[:label],
            description: action_description
          )
          @new_npc.monster_actions << action
        end
      end
    end

    def action_damage(action, npc_dam_bonus)
      action_damage_bonus = if npc_dam_bonus > 0
                              "+ #{npc_dam_bonus}"
                            elsif npc_dam_bonus == 0
                              ""
                            else
                              "- #{npc_dam_bonus.abs}"
                            end
      damage_dice_count = action[:data][:damage_dice_count].to_i
      damage_dice_value = action[:data][:damage_dice_value].to_i
      base_damage = ((damage_dice_count * damage_dice_value + npc_dam_bonus) * 0.55).ceil
      [action_damage_bonus, base_damage]
    end

    # 2e conversions

    def convert_2e_stats(stats)
      convert_2e_armor_class(stats[:armor_class].to_i)
      convert_2e_calculate_cr(stats[:hit_points].to_i)
      convert_2e_speed(stats[:speed].to_i)
    end

    def convert_2e_armor_class(armor_class)
      @new_npc.armor_class = 19 - armor_class
    end

    def convert_2e_calculate_cr(hit_points)
      crs = DndRules.challenge_ratings
      @new_npc.hit_points = hit_points * 2
      crs.each do |key, cr_object|
        if @new_npc.hit_points >= cr_object[:hit_points_min] && @new_npc.hit_points < cr_object[:hit_points_max]
          @new_npc.challenge_rating = key
          con_modifier = DndRules.ability_score_modifier(@new_npc.constitution)
          hit_points_info = DndRules.calculate_hp_and_hd(@new_npc.size, @new_npc.challenge_rating, con_modifier, @new_npc.hit_points)
          @new_npc.hit_dice = hit_points_info[:num_hit_die]
          @new_npc.hit_points = hit_points_info[:hit_points]
          @new_npc.hit_dice_modifier = @new_npc.hit_dice_number * con_modifier
        end
      end
    end

    # @todo check this out with monsters, but for now this is just for humanoids
    def convert_2e_speed(speed)
      speed_5e = ((speed.to_f / 4) * 10).ceil
      @new_npc.speed = "#{speed_5e} ft."
    end

    #
    # # Spells
    #
    # def add_spells
    #   spell_slots = []
    #   @new_npc.character_classes.each do |character_class|
    #     slots = SpellSlots.spell_slots(character_class)
    #     next if slots.nil?
    #     spell_slots << {
    #       dnd_class: character_class.dnd_class.name,
    #       slots: slots
    #     }
    #   end
    #   spell_slots.each do |class_slots|
    #     add_spells_for_level(0, class_slots[:dnd_class], class_slots[:slots][:cantrips])
    #     if class_slots[:dnd_class] != 'Warlock'
    #       add_spells_for_level(1, class_slots[:dnd_class], class_slots[:slots][:level_1])
    #       add_spells_for_level(2, class_slots[:dnd_class], class_slots[:slots][:level_2])
    #       add_spells_for_level(3, class_slots[:dnd_class], class_slots[:slots][:level_3])
    #       add_spells_for_level(4, class_slots[:dnd_class], class_slots[:slots][:level_4])
    #       add_spells_for_level(5, class_slots[:dnd_class], class_slots[:slots][:level_5])
    #       add_spells_for_level(6, class_slots[:dnd_class], class_slots[:slots][:level_6])
    #       add_spells_for_level(7, class_slots[:dnd_class], class_slots[:slots][:level_7])
    #       add_spells_for_level(8, class_slots[:dnd_class], class_slots[:slots][:level_8])
    #       add_spells_for_level(9, class_slots[:dnd_class], class_slots[:slots][:level_9])
    #     else
    #       spells_known = []
    #       (1..class_slots[:slots][:total_known]).each do
    #         spell_level = rand(1..class_slots[:slots][:slot_level])
    #         spell = SpellSlots.random_spell(class_slots[:dnd_class], spell_level, spells_known)
    #         next if spell.nil?
    #
    #         spells_known << spell
    #         @new_npc.character_spells << CharacterSpell.new(is_prepared: false,
    #                                                         spell_class: class_slots[:dnd_class],
    #                                                         spell: spell)
    #       end
    #     end
    #   end
    # end

  end
end
