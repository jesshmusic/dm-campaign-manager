# frozen_string_literal: true

MAX_RETRIES = 5

class NpcGenerator
  COMMONER_ROLES = {
    'blacksmith' => { Strength: 100, Constitution: 80, Dexterity: 40, Intelligence: 30, Wisdom: 40, Charisma: 30 },
    'noble' => { Charisma: 100, Intelligence: 60, Wisdom: 40, Strength: 20, Dexterity: 30, Constitution: 30 },
    'merchant' => { Charisma: 80, Intelligence: 60, Wisdom: 50, Strength: 30, Dexterity: 40, Constitution: 40 },
    'guard' => { Strength: 80, Constitution: 70, Dexterity: 50, Wisdom: 40, Intelligence: 30, Charisma: 30 },
    'farmer' => { Strength: 70, Constitution: 80, Wisdom: 40, Dexterity: 40, Intelligence: 30, Charisma: 30 },
    'scholar' => { Intelligence: 100, Wisdom: 70, Charisma: 30, Strength: 20, Dexterity: 30, Constitution: 30 },
    'healer' => { Wisdom: 100, Intelligence: 60, Charisma: 50, Strength: 20, Dexterity: 40, Constitution: 40 },
    'entertainer' => { Charisma: 100, Dexterity: 60, Intelligence: 40, Strength: 30, Wisdom: 40, Constitution: 40 },
    'sailor' => { Strength: 70, Dexterity: 60, Constitution: 70, Wisdom: 50, Intelligence: 30, Charisma: 30 },
    'servant' => { Dexterity: 60, Wisdom: 50, Charisma: 40, Strength: 40, Constitution: 40, Intelligence: 40 }
  }.freeze

  class << self
    def fetch_records
      @start = Time.zone.now
      current_monster_type = if @new_npc.monster_type.include? 'humanoid'
                               'humanoid'
                             else
                               @new_npc.monster_type
                             end
      selected_monster_type = current_monster_type
      monster_types = Monster.group(:monster_type).count(:monster_type)
      monster_types[selected_monster_type] = 300
      weighted_monster_types = WeightedList[monster_types].sample(3)
      @weighted_resistances = WeightedList[Monster.where(monster_type: current_monster_type).group(:damage_resistances).count(:damage_resistances)]
      @weighted_immunities = WeightedList[Monster.where(monster_type: current_monster_type).group(:damage_immunities).count(:damage_immunities)]
      @weighted_vulnerabilities = WeightedList[Monster.where(monster_type: current_monster_type).group(:damage_vulnerabilities).count(:damage_vulnerabilities)]
      @weighted_conditions = WeightedList[Monster.where(monster_type: current_monster_type).group(:condition_immunities).count(:condition_immunities)]
      @weighted_languages = WeightedList[Monster.where(monster_type: current_monster_type).group(:languages).count(:languages)]
      @weighted_senses = WeightedList[Sense.joins(:monster).where(monster: { monster_type: current_monster_type }).group(:name, :value).count(:name)]
      @sense_chance = Monster.count.to_f / Sense.count
      @weighted_speeds = WeightedList[Speed.joins(:monster).where(monster: { monster_type: weighted_monster_types }).group(:name,
                                                                                                                           :value).count(:name)]
      finish = (Time.zone.now - @start)
      Rails.logger.debug finish
    end

    def quick_monster(monster_params, user)
      # Check if AI-generated actions were provided
      has_ai_actions = monster_params[:monster_actions_attributes].present? ||
                       monster_params[:special_abilities_attributes].present?

      # Exclude control fields but keep nested attributes for actions/abilities
      # creature_description is only used for AI prompts, not stored on Monster
      excluded_fields = %i[number_of_attacks archetype action_options spell_ids special_ability_options creature_description]
      @new_npc = Monster.new(monster_params.except(*excluded_fields))
      @action_options = monster_params[:action_options] || []
      @spell_ids = monster_params[:spell_ids] || []
      fetch_records
      @archetype = monster_params[:archetype]
      @new_npc.slug = @new_npc.name.parameterize
      calculate_hd
      ability_score_order = get_ability_score_order
      spellcasting_ability = ability_score_order[0]
      cr_info = CrCalc.challenge_ratings[monster_params[:challenge_rating].to_sym]
      @new_npc.prof_bonus = cr_info[:prof_bonus]
      @new_npc.save_dc = calculate_save_dc(spellcasting_ability, cr_info[:save_dc])
      set_ability_scores(ability_score_order, monster_params)
      @new_npc.attack_bonus = calculate_attack_bonus

      # Only generate actions from action_options if no AI-generated actions provided
      unless has_ai_actions
        generate_actions(
          monster_params[:number_of_attacks],
          CrCalc.cr_string_to_num(monster_params[:challenge_rating]),
          cr_info[:save_dc],
          spellcasting_ability
        )
        generate_special_abilities(@new_npc, monster_params[:special_ability_options] || [])
      end

      generate_stats
      adjust_proficiency_bonuses

      @new_npc.slug = @new_npc.name.parameterize if user.nil?
      set_challenge_rating(monster_params[:challenge_rating])
      maybe_save_npc(user)
      finish = (Time.zone.now - @start)
      Rails.logger.debug finish
      @new_npc
    end

    def generate_commoner(random_npc_gender, random_npc_race, user, role = nil, description = nil)
      commoner = Monster.where(name: 'Commoner').first
      commoner_atts = commoner.attributes
      @new_npc = Monster.new commoner_atts
      @new_npc.id = nil
      @new_npc.slug = nil
      @new_npc.challenge_rating = %w[0 0 0 0 0 1/8 1/8 1/8 1/4 1/4 1/2].sample

      # Use role-based ability weighting if role provided
      ability_score_order = if role.present? && COMMONER_ROLES[role.downcase]
                              weighted_abilities = WeightedList[COMMONER_ROLES[role.downcase]]
                              weighted_abilities.sample(6).map(&:to_s)
                            else
                              %w[Strength Dexterity Constitution Intelligence Wisdom Charisma].shuffle
                            end
      set_ability_scores(ability_score_order)
      @new_npc.name = NameGen.random_name(gender: random_npc_gender, race: random_npc_race, role: role)
      @new_npc.monster_subtype = random_npc_race || 'human'

      # Other statistics
      @new_npc.armor_class = @new_npc.armor_class + DndRules.ability_score_modifier(@new_npc.dexterity)
      @new_npc.alignment = DndRules.alignments_non_evil.sample
      @new_npc.hit_points += DndRules.ability_score_modifier(@new_npc.constitution)
      @new_npc.description = description if description.present?
      @new_npc.slug = @new_npc.name.parameterize if user.nil?
      maybe_save_npc(user)
      @new_npc
    end

    def generate_action_desc(action_params)
      params = action_params[:params]
      action = params[:action]

      # Handle case where action is nil (incomplete form data)
      return '' if action.nil?

      case action[:action_type]
      when 'attack'
        generate_attack_desc(action, params[:attack_bonus], params[:prof_bonus], params[:damage_bonus])
      when 'spellCasting'
        generate_spellcasting_desc(params[:monster_name], action)
      else
        action[:desc] || ''
      end
    end

    def action_damage(damage_dice, npc_dam_bonus, action_desc)
      action_damage_bonus = if npc_dam_bonus.positive?
                              "+ #{npc_dam_bonus}"
                            elsif npc_dam_bonus.zero?
                              ''
                            else
                              "- #{npc_dam_bonus.abs}"
                            end
      base_damage = if damage_dice
                      parsed_dice = DndRules.parse_dice_string(damage_dice)
                      damage_dice_count = parsed_dice[:hit_dice_number]
                      damage_dice_value = parsed_dice[:hit_dice_value]
                      (((damage_dice_count * damage_dice_value) + npc_dam_bonus) * 0.55).ceil
                    elsif /([1-9]\d*)(?:\s)(?:\([1-9]\d*)?d([1-9]\d*)\)/.match(action_desc)
                      other_damage = /([1-9]\d*)(?:\s)(?:\([1-9]\d*)?d([1-9]\d*)\)/.match(action_desc).captures
                      if other_damage.nil?
                        0
                      else
                        other_damage.first
                      end
                    else
                      0
                    end

      [action_damage_bonus, base_damage]
    end

    private

    def set_challenge_rating(_target_cr = @new_npc.challenge_rating)
      # Quick NPC uses selected CR, not AI calculation
      calculated_cr = CrCalc.calculate_challenge(@new_npc, use_ai: false)
      cr_info = calculated_cr[:data]
      @new_npc.challenge_rating = calculated_cr[:name]
      Rails.logger.debug cr_info
      @new_npc.xp = cr_info['xp']
      @new_npc.prof_bonus = cr_info['prof_bonus']
      @new_npc.save_dc = cr_info['save_dc']
    end

    def get_ability_score_order
      weighted_abilities = if @archetype == 'spellcaster' || @spell_ids.any?
                             WeightedList[{
                               Strength: 5,
                               Dexterity: 20,
                               Constitution: 10,
                               Wisdom: 500,
                               Intelligence: 750,
                               Charisma: 350
                             }]
                           elsif @archetype == 'rogue'
                             WeightedList[{
                               Strength: 20,
                               Dexterity: 100,
                               Constitution: 30,
                               Wisdom: 25,
                               Intelligence: 5,
                               Charisma: 25
                             }]
                           elsif @archetype == 'cleric'
                             WeightedList[{
                               Strength: 100,
                               Dexterity: 50,
                               Constitution: 50,
                               Wisdom: 200,
                               Intelligence: 50,
                               Charisma: 150
                             }]
                           elsif @archetype == 'warrior'
                             WeightedList[{
                               Strength: 200,
                               Dexterity: 75,
                               Constitution: 150,
                               Wisdom: 10,
                               Intelligence: 10,
                               Charisma: 10
                             }]
                           else
                             WeightedList[{
                               Strength: 50,
                               Dexterity: 30,
                               Constitution: 35,
                               Wisdom: 10,
                               Intelligence: 5,
                               Charisma: 5
                             }]
                           end
      weighted_abilities.sample(6)
    end

    def min_score_for_cr(challenge_rating)
      c_rating = CrCalc.cr_string_to_num(challenge_rating)
      result = if c_rating < 10
                 12
               else
                 [c_rating * (1 + ((c_rating - 10 + 4) / 100)), 30].min
               end
      result.round
    end

    def calculate_attack_bonus
      case @archetype
      when 'Rogue'
        DndRules.ability_score_modifier(@new_npc.dexterity) + @new_npc.prof_bonus
      else
        DndRules.ability_score_modifier(@new_npc.strength) + @new_npc.prof_bonus
      end
    end

    def maybe_save_npc(user)
      return unless user && (user.dungeon_master? || user.admin?)

      @new_npc.user = user unless user.nil?
      @new_npc.save! unless user.nil?
    end

    def generate_attack_desc(monster_action, attack_bonus, prof_bonus, damage_bonus)
      return monster_action[:desc] if monster_action[:damage].nil?

      damage = monster_action[:damage]
      damage_2h = monster_action[:two_handed_damage]
      hit_string = "#{plus_number_string(attack_bonus + prof_bonus)} to hit"
      target_string = "#{damage[:num_targets].to_i.humanize.downcase} target#{'s' if damage[:num_targets].to_i > 1}"
      desc = if damage && damage[:is_ranged]
               range_string = "range (#{damage[:range_normal]} / #{damage[:range_long]}), #{target_string}"
               "Ranged Weapon Attack: #{hit_string}, #{range_string}"
             else
               reach_string = damage[:reach] ? "#{damage[:reach]} ft." : '5 ft.'
               "Melee Weapon Attack: #{hit_string}, reach #{reach_string}, #{target_string}"
             end
      damage_string = "Hit: #{average_dice(damage[:num_dice], damage[:dice_value],
                                           damage_bonus)} (#{damage[:num_dice]}d#{damage[:dice_value]}#{if damage_bonus != 0
                                                                                                          plus_number_string(damage_bonus,
                                                                                                                             true)
                                                                                                        end}) #{damage[:damage_type]} damage"
      if damage_2h && damage_2h[:damage_type]
        damage_string = "#{damage_string}. or #{average_dice(damage_2h[:num_dice], damage_2h[:dice_value],
                                                             damage_bonus)} (#{damage_2h[:num_dice]}d#{damage_2h[:dice_value]}#{if damage_bonus != 0
                                                                                                                                  plus_number_string(damage_bonus,
                                                                                                                                                     true)
                                                                                                                                end}) #{damage_2h[:damage_type]} damage if used with two hands."
      else
        damage_string = "#{damage_string}."
      end
      "#{desc} #{damage_string}"
    end

    def generate_special_abilities(monster, ability_names)
      ability_names.each do |name|
        abilities = SpecialAbility.where(name: name)
        Rails.logger.debug abilities.count
        next unless abilities.any?

        ability = abilities.first
        monster.special_abilities << SpecialAbility.create(name: ability.name,
                                                           desc: adapt_action_desc(
                                                             ability.desc, ability.monster ? ability.monster.name.downcase : 'NewMonster'
                                                           ))
      end
    end

    def generate_spellcasting_desc(monster_name, action)
      return action[:desc] if action[:spell_casting].nil?

      spellcasting = action[:spell_casting]
      desc = "The #{monster_name} is a #{spellcasting[:level].to_i.ordinalize} level spellcaster. Its spellcasting ability is #{spellcasting[:ability]}. The #{monster_name} has the following spells prepared."
      unless spellcasting[:spell_options].empty?
        cantrip_spells = spellcasting[:spell_options]
                         .select { |spell| spell[:data][:level].to_i.zero? }
                         .pluck(:label)
                         .join(', ')
        level1_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 1 }
                        .pluck(:label)
                        .join(', ')
        level2_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 2 }
                        .pluck(:label)
                        .join(', ')
        level3_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 3 }
                        .pluck(:label)
                        .join(', ')
        level4_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 4 }
                        .pluck(:label)
                        .join(', ')
        level5_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 5 }
                        .pluck(:label)
                        .join(', ')
        level6_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 6 }
                        .pluck(:label)
                        .join(', ')
        level7_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 7 }
                        .pluck(:label)
                        .join(', ')
        level8_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 8 }
                        .pluck(:label)
                        .join(', ')
        level9_spells = spellcasting[:spell_options]
                        .select { |spell| spell[:data][:level].to_i == 9 }
                        .pluck(:label)
                        .join(', ')
        desc += "\nCantrips (at will): #{cantrip_spells}" unless cantrip_spells.empty?
        desc += "\n1st level (#{spellcasting[:slots][:first]} slots): #{level1_spells}" unless level1_spells.empty?
        desc += "\n2nd level (#{spellcasting[:slots][:second]} slots): #{level2_spells}" unless level2_spells.empty?
        desc += "\n3rd level (#{spellcasting[:slots][:third]} slots): #{level3_spells}" unless level3_spells.empty?
        desc += "\n4th level (#{spellcasting[:slots][:fourth]} slots): #{level4_spells}" unless level4_spells.empty?
        desc += "\n5th level (#{spellcasting[:slots][:fifth]} slots): #{level5_spells}" unless level5_spells.empty?
        desc += "\n6th level (#{spellcasting[:slots][:sixth]} slots): #{level6_spells}" unless level6_spells.empty?
        desc += "\n7th level (#{spellcasting[:slots][:seventh]} slots): #{level7_spells}" unless level7_spells.empty?
        desc += "\n8th level (#{spellcasting[:slots][:eighth]} slots): #{level8_spells}" unless level8_spells.empty?
        desc += "\n8th level (#{spellcasting[:slots][:ninth]} slots): #{level9_spells}" unless level9_spells.empty?
      end
      desc
    end

    def average_dice(num_dice, dice_value, modifier)
      dice_average = (dice_value / 2) + 0.5
      base_damage = dice_average * num_dice.to_f
      (base_damage + modifier).floor
    end

    def plus_number_string(number, space = false)
      sign = '+'
      if number === 0
        sign = ''
      elsif number.negative?
        sign = '-'
      end

      "#{sign}#{' ' if space}#{number.abs}"
    end

    # Spellcasting

    def calculate_save_dc(spellcasting_ability, save_dc)
      ability_mod = case spellcasting_ability
                    when 'Intelligence'
                      DndRules.ability_score_modifier(@new_npc.intelligence)
                    when 'Wisdom'
                      DndRules.ability_score_modifier(@new_npc.wisdom)
                    else
                      DndRules.ability_score_modifier(@new_npc.charisma)
                    end
      save_dc + ability_mod
    end

    # Statistics
    def rolls_for_cr
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      modifier_for_cr = (cr_int / 10).round - 1
      dice_rolls =
        [
          DndRules.roll_dice(1, 6, modifier_for_cr),
          DndRules.roll_dice(1, 6, modifier_for_cr),
          DndRules.roll_dice(1, 6, modifier_for_cr)
        ]
      case cr_int
      when 0..8
        dice_rolls
      when 9..16
        dice_rolls << DndRules.roll_dice(1, 6, modifier_for_cr)
      else
        dice_rolls << DndRules.roll_dice(1, 6, modifier_for_cr)
        dice_rolls << DndRules.roll_dice(1, 6, modifier_for_cr)
      end
    end

    def ability_mod_for_cr
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      (cr_int / 5).round
    end

    def set_ability_scores(score_priority = [], monster_params)
      ability_scores = Array.new(6)
      ability_scores.each_with_index do |_, index|
        rolls = rolls_for_cr
        rolls.delete_at(rolls.index(rolls.min)) while rolls.count > 3
        ability_scores[index] = rolls.sum
      end
      score_priority.each_with_index do |ability, index|
        if monster_params[ability.to_s.downcase]
          case ability.to_s
          when 'Strength'
            @new_npc.strength = monster_params[ability.to_s.downcase]
          when 'Dexterity'
            @new_npc.dexterity = monster_params[ability.to_s.downcase]
          when 'Constitution'
            @new_npc.constitution = monster_params[ability.to_s.downcase]
          when 'Intelligence'
            @new_npc.intelligence = monster_params[ability.to_s.downcase]
          when 'Wisdom'
            @new_npc.wisdom = monster_params[ability.to_s.downcase]
          when 'Charisma'
            @new_npc.charisma = monster_params[ability.to_s.downcase]
          else
            Rails.logger.debug { "Ability #{ability} not found!" }
          end
        else
          set_primary_ability(ability.to_s, ability_scores, index)
        end
      end
    end

    def set_primary_ability(ability, ability_scores, index)
      highest_score = ability_scores.delete_at(ability_scores.index(ability_scores.max))
      modifier = ability_mod_for_cr - (index / 2).round
      case ability
      when 'Strength'
        @new_npc.strength = highest_score + modifier
      when 'Dexterity'
        @new_npc.dexterity = highest_score + modifier
      when 'Constitution'
        @new_npc.constitution = highest_score + modifier
      when 'Intelligence'
        @new_npc.intelligence = highest_score + modifier
      when 'Wisdom'
        @new_npc.wisdom = highest_score + modifier
      when 'Charisma'
        @new_npc.charisma = highest_score + modifier
      else
        Rails.logger.debug { "Ability #{ability} not found!" }
      end
    end

    def calculate_hd
      con_mod = DndRules.ability_score_modifier(@new_npc.constitution)
      hit_dice = @new_npc.hit_dice.scan(/\d+/)
      average_hp = (hit_dice.last.to_f / 2) + 0.5
      current_hd = (@new_npc.hit_points / (average_hp + con_mod)).round
      @new_npc.hit_dice = "#{current_hd}d#{hit_dice.last}"
    end

    def adjust_hd(is_incrementing)
      con_mod = DndRules.ability_score_modifier(@new_npc.constitution)
      hit_dice = @new_npc.hit_dice.scan(/\d+/)
      average_hp = (hit_dice.last.to_f / 2) + 0.5
      if is_incrementing
        @new_npc.hit_points += average_hp.floor
      else
        @new_npc.hit_points -= average_hp.ceil
      end
      current_hd = (@new_npc.hit_points / (average_hp + con_mod)).round
      @new_npc.hit_dice = "#{current_hd}d#{hit_dice.last}"
    end

    def adjust_proficiency_bonuses
      @new_npc.monster_proficiencies.each do |monster_prof|
        prof = monster_prof.prof
        if prof.prof_type == 'Saving Throws'
          prof_ability = prof.name.split(':')[1].strip
          monster_prof.value = case prof_ability
                               when 'CHA'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.charisma)
                               when 'CON'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.constitution)
                               when 'DEX'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.dexterity)
                               when 'INT'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.intelligence)
                               when 'STR'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.strength)
                               else
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.wisdom)
                               end
        elsif prof.prof_type == 'Skills'
          skill_ability = DndRules.skill_abilities[prof.name]
          monster_prof.value = case skill_ability
                               when 'charisma'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.charisma)
                               when 'constitution'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.constitution)
                               when 'dexterity'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.dexterity)
                               when 'intelligence'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.intelligence)
                               when 'strength'
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.strength)
                               else
                                 @new_npc.prof_bonus + DndRules.ability_score_modifier(@new_npc.wisdom)
                               end
        end
        Rails.logger.debug prof
      end
    end

    # Actions

    def generate_actions(number_of_attacks, challenge_rating, save_dc, primary_ability)
      attacks = []
      attacks << create_actions(number_of_attacks)
      attacks << create_spellcasting(challenge_rating, save_dc, primary_ability) if @spell_ids.any?
    end

    def create_multiattack(num_attacks, attack_names)
      damage_attacks = []
      attack_names.each do |attack_name|
        action = MonsterAction.find_by(name: attack_name)
        damage_attacks << action.name if action.desc.include?('Melee') && action.desc.include?('to hit')
      end
      return unless num_attacks > 1

      if damage_attacks.none?
        nil
      else
        next_attack = damage_attacks.sample
        multi_desc = "The #{@new_npc.name} makes #{num_attacks} #{next_attack.downcase} attacks."
        multi_attack = MonsterAction.new(
          name: 'Multiattack',
          desc: multi_desc
        )
        @new_npc.monster_actions << multi_attack
      end
    end

    def create_actions(num_attacks)
      attack_names = []

      attacks = @action_options.map do |action_id|
        action = Action.find(action_id)
        attack_names << action.name if action.type == 'MonsterAction'
        action
      end
      create_multiattack(num_attacks, attack_names) if attack_names.any?
      attacks.each do |attack|
        case attack.type
        when 'LegendaryAction'
          @new_npc.legendary_actions << LegendaryAction.new(name: attack.name,
                                                            desc: adapt_action_desc(
                                                              attack.desc, attack.monster ? attack.monster.name.downcase : 'NewMonster'
                                                            ))
        when 'Reaction'
          @new_npc.reactions << Reaction.new(name: attack.name,
                                             desc: adapt_action_desc(attack.desc,
                                                                     attack.monster ? attack.monster.name.downcase : 'NewMonster'))
        when 'SpecialAbility'
          @new_npc.special_abilities << SpecialAbility.new(name: attack.name,
                                                           desc: adapt_action_desc(
                                                             attack.desc, attack.monster ? attack.monster.name.downcase : 'NewMonster'
                                                           ))
        else
          @new_npc.monster_actions << MonsterAction.new(name: attack.name,
                                                        desc: adapt_action_desc(attack.desc,
                                                                                attack.monster ? attack.monster.name.downcase : 'NewMonster'))
        end
      end
      # end
    end

    def create_spellcasting(challenge_rating, save_dc, primary_ability)
      action = {}
      action[:name] = 'Spellcasting'
      action[:caster_level] = CrCalc.caster_level_for_cr(challenge_rating)
      action[:save_dc] = save_dc
      action[:primary_ability] = primary_ability
      @new_npc.special_abilities << SpecialAbility.create(name: action[:name], desc: parse_spell_action_desc(action))
    end

    def adapt_action_desc(action_desc, monster_name)
      damage_dice = action_desc[/([1-9]\d*)?d([1-9]\d*)/m]
      reach_string = /(?:to hit, )(.*)(?: Hit: )/.match(action_desc).captures if /(?:to hit, )(.*)(?: Hit: )/.match(action_desc)
      damage_type = /\) (.*) damage(,|\.)/.match(action_desc).captures if /\) (.*) damage(,|\.)/.match(action_desc)
      special_string = if /(?:damage(?:,|\.) )(.*)/.match(action_desc)
                         special = /(?:damage(?:,|\.) )(.*)/.match(action_desc).captures
                         special_string = special.first unless special.nil?
                         special_string&.gsub(monster_name, @new_npc.name.downcase)
                       end
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
      action_damage_bonus, base_damage = action_damage(damage_dice, npc_dam_bonus, action_desc)
      result = if reach_string && damage_type
                 "Melee Weapon Attack: +#{@new_npc.attack_bonus} to hit, #{reach_string.first} Hit: #{base_damage} (#{damage_dice} #{action_damage_bonus}) #{damage_type.first} damage#{damage_type[1]} #{special_string}"
               else
                 action_desc.gsub(monster_name, @new_npc.name.downcase)
               end

      save_dcs = /(?:DC )([1-9]\d*)(?:\s)/.match(action_desc)
      save_dcs&.captures&.each do |save_str|
        result = result.gsub(save_str, @new_npc.save_dc.to_s)
      end
      result
    end

    def parse_spell_action_desc(action)
      spell_slots = DndRules.npc_spell_slots(action[:caster_level])
      spell_str = "The #{@new_npc.name.downcase} is a #{action[:caster_level].ordinalize} level spellcaster. Its spellcasting ability is #{action[:primary_ability]}. The #{@new_npc.name.downcase} has the following spells prepared.  \n"
      spells = [{ name: 'Cantrips', slots: -1, spells: [] },
                { name: '1st Level', slots: spell_slots[0], spells: [] },
                { name: '2nd Level', slots: spell_slots[1], spells: [] },
                { name: '3rd Level', slots: spell_slots[2], spells: [] },
                { name: '4th Level', slots: spell_slots[3], spells: [] },
                { name: '5th Level', slots: spell_slots[4], spells: [] },
                { name: '6th Level', slots: spell_slots[5], spells: [] },
                { name: '7th Level', slots: spell_slots[6], spells: [] },
                { name: '8th Level', slots: spell_slots[7], spells: [] },
                { name: '9th Level', slots: spell_slots[8], spells: [] }]
      @spell_ids.each do |spell_id|
        spell = Spell.find(spell_id)
        spells[spell.level][:spells] << spell.name
      end
      spells.each do |spell_list|
        next unless spell_list[:spells].any?

        spell_str += if spell_list[:name] == 'Cantrips'
                       "Cantrips (at will): #{spell_list[:spells].join(', ')}  \n"
                     else
                       "#{spell_list[:name]} (#{spell_list[:slots]} #{'slot'.pluralize(spell_list[:slots])}): #{spell_list[:spells].join(', ')}  \n"
                     end
      end
      spell_str
    end

    def parse_action_with_weight(action)
      current_monster_type = @new_npc.monster_type.include? 'humanoid'
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      monster_cr = [CrCalc.cr_string_to_num(action.monster.challenge_rating), 0.125].max
      weight = (1 / [monster_cr - cr_int, 0.125].max.abs) * 100
      weight *= 5 if action.monster.monster_type == current_monster_type
      action_desc = replace_monster_name(action.desc, action.monster.name)
      save_dcs = /(?:DC )([1-9]\d*)(?:\s)/m.match(action_desc)
      save_dcs&.captures&.each do |save_str|
        action_desc = action_desc.gsub(save_str, @new_npc.save_dc.to_s)
      end
      attack_info = { name: action.name, desc: action_desc, monster: action.monster.name }
      [attack_info, weight]
    end

    def generate_senses
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      senses_chance = (cr_int / 30) * 5
      num_senses = rand(1..(cr_int / 8).ceil)
      num_senses ||= 1
      senses = @weighted_senses.sample(num_senses)
      if rand < senses_chance
        sense_names = ['Passive Perception']
        senses.each do |sense|
          unless sense_names.include? sense[0]
            @new_npc.senses << Sense.new(name: sense[0], value: sense[1])
            sense_names << sense[0]
          end
        end
      end
      @new_npc.senses << calculate_passive_perception
    end

    def calculate_passive_perception
      if @new_npc.has_perception
        Sense.new(name: 'passive Perception', value: 10 + DndRules.ability_score_modifier(@new_npc.wisdom) + @new_npc.prof_bonus)
      else
        Sense.new(name: 'passive Perception', value: 10 + DndRules.ability_score_modifier(@new_npc.wisdom))
      end
    end

    def generate_speeds
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      num_senses = rand(1..(cr_int / 8).ceil)
      num_senses ||= 1
      speeds = @weighted_speeds.sample(num_senses)
      speed_names = []
      speeds.each do |speed|
        unless speed_names.include? speed[0]
          @new_npc.speeds << Speed.new(name: speed[0], value: speed[1])
          speed_names << speed[0]
        end
      end
    end

    # Resistances
    def generate_stats
      @new_npc.damage_resistances = @weighted_resistances.sample
      @new_npc.damage_immunities = @weighted_immunities.sample
      @new_npc.damage_vulnerabilities = @weighted_vulnerabilities.sample
      @new_npc.condition_immunities = @weighted_conditions.sample
      @new_npc.languages = @weighted_languages.sample
      generate_senses
      generate_speeds
    end

    def replace_monster_name(action_desc, monster_name)
      action_monster_name = monster_name.downcase
      action_name_parts = monster_name.downcase.split
      action_desc = action_desc.gsub(action_monster_name, @new_npc.name.downcase)
      action_name_parts.each do |name_part|
        action_desc = action_desc.gsub(name_part, @new_npc.name.downcase)
      end
      action_desc
    end
  end
end
