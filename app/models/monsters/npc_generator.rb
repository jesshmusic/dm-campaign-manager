# frozen_string_literal: true

class NpcGenerator
  class << self

    def quick_monster(monster_params, user)
      puts monster_params
      @new_npc = Monster.new(monster_params.except(:number_of_attacks, :archetype))
      @new_npc.slug = @new_npc.name.parameterize
      ability_score_order = get_ability_score_order(monster_params[:archetype])
      spellcasting_ability = ability_score_order[0]
      cr_info = CrCalc.challenge_ratings[monster_params[:challenge_rating].to_sym]
      @new_npc.attack_bonus = cr_info[:attack_bonus]
      @new_npc.prof_bonus = cr_info[:prof_bonus]
      @new_npc.save_dc = calculate_save_dc(spellcasting_ability, cr_info[:save_dc])
      set_ability_scores(ability_score_order, 'Constitution')
      generate_actions(
        (cr_info[:damage_max] - cr_info[:damage_min]) / 2 + cr_info[:damage_min],
        monster_params[:archetype],
        monster_params[:number_of_attacks],
        CrCalc.cr_string_to_num(monster_params[:challenge_rating]),
        cr_info[:save_dc],
        spellcasting_ability
      )
      @new_npc.slug = @new_npc.name.parameterize if user.nil?

      cr_params = {
        params: {
          monster: @new_npc.monster_atts,
        }
      }
      calculated_cr = CrCalc.calculate_cr(cr_params.deep_symbolize_keys, true, monster_params[:archetype])
      if calculated_cr[:name] != @new_npc.challenge_rating
        cr_data = calculated_cr[:data].symbolize_keys
        @new_npc.challenge_rating = calculated_cr[:name]
        @new_npc.xp = cr_data[:xp]
      end
      maybe_save_npc(user)
      @new_npc
    end

    def generate_npc(monster_params, user)
      @new_npc = Monster.new(monster_params)
      @new_npc.slug = @new_npc.name.parameterize if user.nil?
      maybe_save_npc(user)
      @new_npc
    end

    def generate_commoner(random_npc_gender, random_npc_race, user)
      commoner = Monster.where(name: 'Commoner').first
      commoner_atts = commoner.attributes
      @new_npc = Monster.new commoner_atts
      @new_npc.id = nil
      @new_npc.slug = nil
      @new_npc.challenge_rating = %w[0 0 0 0 0 1/8 1/8 1/8 1/4 1/4 1/2].sample
      ability_score_order = %w[Strength Dexterity Constitution Intelligence Wisdom Charisma].shuffle
      set_ability_scores(ability_score_order)
      @new_npc.name = NameGen.random_name(random_npc_gender, random_npc_race)
      @new_npc.monster_subtype = random_npc_race ? random_npc_race : 'human'

      # Other statistics
      @new_npc.armor_class = @new_npc.armor_class + DndRules.ability_score_modifier(@new_npc.dexterity)
      @new_npc.alignment = DndRules.alignments_non_evil.sample
      @new_npc.hit_points += DndRules.ability_score_modifier(@new_npc.constitution)
      @new_npc.slug = @new_npc.name.parameterize if user.nil?
      maybe_save_npc(user)
      @new_npc
    end

    def generate_action_desc(action_params)
      params = action_params[:params]
      case params[:action][:action_type]
      when 'attack'
        generate_attack_desc(params[:action], params[:attack_bonus], params[:prof_bonus], params[:damage_bonus])
      when 'spellcasting'
        generate_spellcasting_desc(params[:monster_name], params[:action])
      else
        params[:action][:desc]
      end
    end

    private

    def get_ability_score_order(archetype = 'fighter')
      weighted_abilities = case archetype
                           when 'spellcaster'
                             WeightedList[{
                                            Strength: 5,
                                            Dexterity: 20,
                                            Constitution: 10,
                                            Wisdom: 50,
                                            Intelligence: 50,
                                            Charisma: 50
                                          }]
                           when 'rogue'
                             WeightedList[{
                                            Strength: 20,
                                            Dexterity: 100,
                                            Constitution: 30,
                                            Wisdom: 25,
                                            Intelligence: 5,
                                            Charisma: 25
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

    def maybe_save_npc(user)
      if user && (user.dungeon_master? || user.admin?)
        @new_npc.user = user unless user.nil?
        @new_npc.save! unless user.nil?
      end
    end

    def generate_attack_desc(monster_action, attack_bonus, prof_bonus, damange_bonus)
      if monster_action[:damage].nil?
        return monster_action[:desc]
      end
      damage = monster_action[:damage]
      hit_string = "#{plus_number_string(attack_bonus + prof_bonus)} to hit"
      target_string = "#{damage[:num_targets].to_i.humanize.downcase} target#{damage[:num_targets].to_i > 1 ? 's' : ''}"
      desc = if damage[:is_ranged]
               range_string = "range (#{damage[:range_normal]} / #{damage[:range_long]}), #{target_string}"
               "Ranged Weapon Attack: #{hit_string}, #{range_string}"
             else
               reach_string = damage[:reach] ? "#{damage[:reach]} ft." : '5 ft.'
               "Melee Weapon Attack: #{hit_string}, reach #{reach_string}, #{target_string}"
             end
      damage_string = "Hit: #{average_dice(damage[:num_dice], damage[:dice_value], damange_bonus)} (#{damage[:num_dice]}d#{damage[:dice_value]}#{damange_bonus != 0 ? plus_number_string(damange_bonus, true) : ''}) #{damage[:damage_type]} damage."
      "#{desc} #{damage_string}"
    end

    def generate_spellcasting_desc(monster_name, action)
      if action[:spell_casting].nil?
        return action[:desc]
      end
      spellcasting = action[:spell_casting]
      desc = "The #{monster_name} is a #{spellcasting[:level].to_i.ordinalize} level spellcaster. Its spellcasting ability is #{spellcasting[:ability]}. The #{monster_name} has the following spells prepared."
      unless spellcasting[:spell_options].empty?
        cantrip_spells = spellcasting[:spell_options]
                           .select { |spell| spell[:data][:level].to_i == 0 }
                           .map { |spell| spell[:label] }
                           .join(', ')
        level1_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 1 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level2_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 2 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level3_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 3 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level4_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 4 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level5_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 5 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level6_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 6 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level7_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 7 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level8_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 8 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        level9_spells = spellcasting[:spell_options]
                          .select { |spell| spell[:data][:level].to_i == 9 }
                          .map { |spell| spell[:label] }
                          .join(', ')
        unless cantrip_spells.empty?
          desc += "\nCantrips (at will): #{cantrip_spells}";
        end
        unless level1_spells.empty?
          desc += "\n1st level (#{spellcasting[:slots][:first]} slots): #{level1_spells}";
        end
        unless level2_spells.empty?
          desc += "\n2nd level (#{spellcasting[:slots][:second]} slots): #{level2_spells}";
        end
        unless level3_spells.empty?
          desc += "\n3rd level (#{spellcasting[:slots][:third]} slots): #{level3_spells}";
        end
        unless level4_spells.empty?
          desc += "\n4th level (#{spellcasting[:slots][:fourth]} slots): #{level4_spells}";
        end
        unless level5_spells.empty?
          desc += "\n5th level (#{spellcasting[:slots][:fifth]} slots): #{level5_spells}";
        end
        unless level6_spells.empty?
          desc += "\n6th level (#{spellcasting[:slots][:sixth]} slots): #{level6_spells}";
        end
        unless level7_spells.empty?
          desc += "\n7th level (#{spellcasting[:slots][:seventh]} slots): #{level7_spells}";
        end
        unless level8_spells.empty?
          desc += "\n8th level (#{spellcasting[:slots][:eighth]} slots): #{level8_spells}";
        end
        unless level9_spells.empty?
          desc += "\n8th level (#{spellcasting[:slots][:ninth]} slots): #{level9_spells}";
        end
      end
      desc
    end

    def average_dice(num_dice, dice_value, modifier)
      dice_average = dice_value / 2 + 0.5
      base_damage = dice_average * num_dice.to_f
      (base_damage + modifier).floor
    end

    def plus_number_string(number, space = false)
      sign = '+'
      if number === 0
        sign = ''
      elsif number < 0
        sign = '-'
      end

      "#{sign}#{space ? ' ' : ''}#{number.abs}"
    end

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
      spell_save_dc = CrCalc.challenge_ratings[spellcasting_class[:level].to_sym][:save_dc]
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
      CrCalc.challenge_ratings[@new_npc.challenge_rating.to_sym]
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
      dice_rolls =
        [
          DndRules.roll_dice(1, 6),
          DndRules.roll_dice(1, 6),
          DndRules.roll_dice(1, 6),
        ]
      c_rating = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      case c_rating
      when 0..8
        dice_rolls
      when 9..16
        dice_rolls << DndRules.roll_dice(1, 6)
      else
        dice_rolls << DndRules.roll_dice(1, 6)
        dice_rolls << DndRules.roll_dice(1, 6)
      end
    end

    def ability_mod_for_cr
      c_rating = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      (c_rating / 5).round
    end

    def set_ability_scores(score_priority = [], skip = nil)
      ability_scores = Array.new(6)
      ability_scores.each_with_index do |_, index|
        rolls = rolls_for_cr
        while rolls.count > 3
          rolls.delete_at(rolls.index(rolls.min))
        end
        ability_scores[index] = rolls.sum
      end
      score_priority.each_with_index do |ability, index|
        set_primary_ability(ability.to_s, ability_scores, index) unless  skip == ability
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
        puts "Ability #{ability} not found!"
      end
    end

    # Actions

    def generate_actions(damage_per_round = 10, archetype, number_of_attacks, challenge_rating, save_dc, primary_ability)
      attacks = []
      ranged_chance = case archetype
                      when 'beast'
                        0.0
                      when 'spellcaster'
                        0.15
                      else
                        0.6
                      end
      if @new_npc.monster_type.downcase == 'humanoid'
        attacks << create_melee_attack(number_of_attacks, archetype)
        if rand > ranged_chance
          attacks << create_ranged_attack
        end
      else
        attacks << create_creature_attacks(damage_per_round, number_of_attacks)
      end
      attacks << create_spellcasting(challenge_rating, save_dc, primary_ability) if archetype == 'spellcaster'
    end

    def create_multiattack(num_attacks, attack_names)
      if num_attacks > 1
        if num_attacks == attack_names.count
          multi_desc = "The #{@new_npc.name} makes #{num_attacks} attacks: "
          attack_strings = attack_names.map do |action|
            "one with its #{action.downcase}"
          end
          multi_desc += attack_strings.to_sentence
          @new_npc.monster_actions << MonsterAction.new(name: 'Multiattack', desc: multi_desc)
        elsif attack_names.count == 1
          attack_name = attack_names[0]
          multi_desc = "The #{@new_npc.name} makes #{num_attacks} #{attack_name.downcase} attacks."
          multi_attack = MonsterAction.new(
            name: 'Multiattack',
            desc: multi_desc
          )
          @new_npc.monster_actions << multi_attack
        else
          multi_desc = "The #{@new_npc.name} makes "
          remaining_attacks = num_attacks
          attack_counts = []
          attack_names.each do |next_attack|
            break unless remaining_attacks > 0
            current_attack_count = rand(1..remaining_attacks)
            attack_counts << {name: next_attack, count: current_attack_count}
            remaining_attacks -= current_attack_count
          end
          attack_strings = attack_counts.map do |attack_count|
            "#{attack_count[:count]} attack#{attack_count[:count] > 1 ? 's' : ''} with its #{attack_count[:name].downcase}"
          end
          multi_desc += attack_strings.to_sentence
          @new_npc.monster_actions << MonsterAction.new(name: 'Multiattack', desc: multi_desc)
        end
      end
    end

    def create_melee_attack(num_attacks, archetype)
      attacks = archetype == 'spellcaster' ? [WeaponItem.caster_weapons.sample] : WeaponItem.fighter_weapons.sample([rand(1..num_attacks), 2].min).uniq
      multiattack_options = []
      attacks.each do |attack_name|
        weapon = WeaponItem.find_by(name: attack_name)
        unless (weapon.properties.include? 'Heavy') || (weapon.properties.include? 'Two-Handed')
          multiattack_options << attack_name
        end
      end
      if multiattack_options.count > 0
        create_multiattack(num_attacks, multiattack_options)
      else
        create_multiattack(num_attacks, [attacks[0]])
      end
      attacks.each do |attack_name|
        attack = {name: attack_name}
        weapon = WeaponItem.find_by(name: attack_name)
        attack[:attack_bonus] = @new_npc.attack_bonus
        attack[:damage_type] = weapon.damage.damage_type
        attack[:damage_dice] = weapon.damage.damage_dice
        attack[:range_normal] = weapon.properties.include?('Reach') ? 10 : 5
        attack_desc = parse_melee_action_desc(attack)
        if weapon.properties&.include?('Thrown')
          attack[:thrown_range_normal] = weapon.item_throw_range.nil? ? 120 : weapon.item_throw_range.normal
          attack[:thrown_range_long] = weapon.item_throw_range.nil? ? 120 : weapon.item_throw_range.long
          attack_desc += parse_thrown_action_desc(attack)
        end
        @new_npc.monster_actions << MonsterAction.new(name: attack[:name], desc: attack_desc)
      end
    end

    def create_ranged_attack
      attack = {}
      attack[:name] = WeaponItem.ranged_weighted.sample
      weapon = WeaponItem.find_by(name: attack[:name])
      attack[:attack_bonus] = @new_npc.attack_bonus
      attack[:damage_type] = weapon.damage.damage_type
      attack[:damage_dice] = weapon.damage.damage_dice
      attack[:range_normal] = weapon.item_range.nil? ? 120 : weapon.item_range.normal
      attack[:range_long] = weapon.item_range.nil? ? 120 : weapon.item_range.long
      @new_npc.monster_actions << MonsterAction.new(name: attack[:name], desc: parse_ranged_action_desc(attack))
    end

    def create_creature_attacks(damage_per_round, num_attacks)
      attack_types = {'Bite': 143, 'Slam': 14, 'Claw': 82, 'Tail': 32}
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      attack_type_list = WeightedList[attack_types]
      attacks = attack_type_list.sample(rand(1..num_attacks)).uniq
      create_multiattack(num_attacks, attacks)
      attacks.each do |next_attack|
        monster_attacks = Hash[MonsterAction.where(name: next_attack.to_s).map do |next_monster_attack|
          monster_cr = [CrCalc.cr_string_to_num(next_monster_attack.monster.challenge_rating), 0.125].max
          weight = (1 / ([monster_cr - cr_int, 0.125].max).abs) * 100
          [next_monster_attack.monster.name, weight]
        end]
        attack_monster_list = WeightedList[monster_attacks]
        attack_monster_name = attack_monster_list.sample
        action = Monster.find_by(name: attack_monster_name).monster_actions.find_by(name: next_attack.to_s)
        @new_npc.monster_actions << MonsterAction.new(name: action.name, desc: adapt_action_desc(action))
      end
    end

    def create_spellcasting(challenge_rating, save_dc, primary_ability)
      action = {}
      action[:name] = 'Spellcasting'
      action[:caster_level] = CrCalc.caster_level_for_cr(challenge_rating)
      action[:save_dc] = save_dc
      action[:primary_ability] = primary_ability
      @new_npc.special_abilities << SpecialAbility.create(name: action[:name], desc: parse_spell_action_desc(action))
    end

    def adapt_action_desc(action)
      action_obj = {
        damage_dice: action.desc[/(\d)d(\d)/m]
      }
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
      action_damage_bonus, base_damage = action_damage(action_obj, npc_dam_bonus)
      reach_string = action.desc[/to hit, (.*) Hit: /m]
      special_string = action.desc[/(?<=damage. )(.*)/m]
      damage_type = action.desc[/\) (.*) damage(,|\.)/m]
      unless special_string.nil?
        puts action_obj[:damage_dice]
      end
      "Melee Weapon Attack: +#{@new_npc.attack_bonus} #{reach_string} #{base_damage} (#{action_obj[:damage_dice]} #{action_damage_bonus}#{damage_type} #{special_string}"
    end

    def parse_melee_action_desc(action)
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
      action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
      "Melee Weapon Attack: +#{@new_npc.attack_bonus} to hit, reach #{action[:range_normal]} ft., one target. Hit: #{base_damage} (#{action[:damage_dice]} #{action_damage_bonus}) #{action[:damage_type].downcase} damage."
    end

    def parse_ranged_action_desc(action)
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
      action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
      "Ranged Weapon Attack: +#{@new_npc.attack_bonus} to hit, range #{action[:range_normal]}/#{action[:range_long]} ft., one target. Hit: #{base_damage} (#{action[:damage_dice]} #{action_damage_bonus}) #{action[:damage_type].downcase} damage."
    end

    def parse_spell_action_desc(action)
      spell_slots = DndRules.npc_spell_slots(action[:caster_level])
      spell_str = "The #{@new_npc.name.downcase} is a #{action[:caster_level].ordinalize} level spellcaster. Its spellcasting ability is #{action[:primary_ability]}. The #{@new_npc.name.downcase} has the following spells prepared.  \n"
      weighted_cantrips = { '0': 50, '1': 25, '2': 25, '3': 25, '4': 15, '5': 10, '6': 5 }
      num_cantrips_list = WeightedList[weighted_cantrips]
      num_cantrips = num_cantrips_list.sample.to_s.to_i
      cantrips = []
      num_cantrips.times do
        cantrips << Spell.where(level: 0).pluck(:name).sample
      end
      spells = [{ name: 'Cantrips', slots: -1, spells: cantrips },
                { name: '1st Level', slots: spell_slots[0], spells: [] },
                { name: '2nd Level', slots: spell_slots[1], spells: [] },
                { name: '3rd Level', slots: spell_slots[2], spells: [] },
                { name: '4th Level', slots: spell_slots[3], spells: [] },
                { name: '5th Level', slots: spell_slots[4], spells: [] },
                { name: '6th Level', slots: spell_slots[5], spells: [] },
                { name: '7th Level', slots: spell_slots[6], spells: [] },
                { name: '8th Level', slots: spell_slots[7], spells: [] },
                { name: '9th Level', slots: spell_slots[8], spells: [] },
      ]
      spell_slots.each_with_index do |slots, index|
        if slots > 0 && slots <= 2
          (slots + rand(0..1)).times do
            spells[index + 1][:spells] << Spell.where(level: index + 1).pluck(:name).sample
          end
        elsif slots > 2
          (slots + rand(-1..1)).times do
            spells[index + 1][:spells] << Spell.where(level: index + 1).pluck(:name).sample
          end
        end
      end
      spells.each do |spell_list|
        if spell_list[:spells].count > 0
          if spell_list[:name] == 'Cantrips'
            spell_str += "Cantrips (at will): #{spell_list[:spells].join(', ')}  \n"
          else
            spell_str += "#{spell_list[:name]} (#{spell_list[:slots]} #{'slot'.pluralize(spell_list[:slots])}): #{spell_list[:spells].join(', ')}  \n"
          end
        end
      end
      spell_str
    end

    def parse_thrown_action_desc(action)
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
      action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
      " Or Ranged Weapon Attack: +#{@new_npc.attack_bonus} to hit, range #{action[:thrown_range_normal]}/#{action[:thrown_range_long]} ft., one target. Hit: #{base_damage} (#{action[:damage_dice]} #{action_damage_bonus}) #{action[:damage_type].downcase} damage."
    end

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
          action_description = ''
          if action[:data][:properties] && action[:data][:properties].include?('Ammunition')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += "Ranged Weapon Attack: +#{CrCalc.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " range #{action[:data][:range_normal]}/#{action[:data][:range_long]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage."
          elsif action[:data][:properties] && action[:data][:properties].include?('Versatile')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            base_2h_damage = ((action[:data][:damage_dice2_h_count] * action[:data][:damage_dice2_h_value] + npc_dam_bonus) * 0.55).ceil
            action_description += "Melee Weapon Attack: +#{CrCalc.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " reach #{action[:data][:range_normal]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage, "
            action_description += "or #{base_2h_damage} (#{action[:data][:damage_dice2_h_count]}d#{action[:data][:damage_dice2_h_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage if used with two hands."
          else
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += "Melee Weapon Attack: +#{CrCalc.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
            action_description += " reach #{action[:data][:range_normal]} ft., one target. "
            action_description += "Hit: #{base_damage} (#{action[:data][:damage_dice_count]}d#{action[:data][:damage_dice_value]} #{action_damage_bonus})"
            action_description += " #{action[:data][:damage_type].downcase} damage."
          end
          if action[:data][:properties] && action[:data][:properties].include?('Thrown')
            npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.dexterity)
            action_damage_bonus, base_damage = action_damage(action, npc_dam_bonus)
            action_description += " Or Ranged Weapon Attack: +#{CrCalc.challenge_ratings[challenge_rating][:attack_bonus]} to hit,"
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
                              ''
                            else
                              "- #{npc_dam_bonus.abs}"
                            end
      parsed_dice = DndRules.parse_dice_string(action[:damage_dice])
      damage_dice_count = parsed_dice[:hit_dice_number]
      damage_dice_value = parsed_dice[:hit_dice_value]
      base_damage = ((damage_dice_count * damage_dice_value + npc_dam_bonus) * 0.55).ceil
      [action_damage_bonus, base_damage]
    end

  end
end
