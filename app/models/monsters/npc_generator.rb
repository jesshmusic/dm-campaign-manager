# frozen_string_literal: true
MAX_RETRIES = 5

ALL_ACTIONS = ['Tentacle', 'Tail', 'Enslave', 'Club', 'Bite', 'Claw', 'Frightful Presence', 'Acid Breath',
               'Lightning Breath', 'Breath Weapons', 'Poison Breath', 'Fire Breath', 'Lair Actions', 'Cold Breath',
               'Slam', 'Whirlwind', 'Change Shape', 'Roar', 'Acid Spray (Recharge 6)', 'Fist', 'Rock', 'Dagger',
               'Shortsword', 'Light Crossbow', 'Rake', 'Beak', 'Warhammer', 'Longsword', 'Whip', 'Teleport',
               'Variant: Summon Demon', 'Scimitar', 'Hurl Flame', 'Beard', 'Glaive', 'Constrict', 'Swallow',
               'Greataxe', 'Claws', 'Pseudopod', 'Tusk', 'Sting', 'Morningstar', 'Javelin', 'Deadly Leap', 'Pike',
               'Hooves', 'Longbow', 'Chain', 'Animate Chains', 'Horns', 'Pincer', 'Tentacles', 'Haste', 'Moan',
               'Phantasms', 'War Pick', 'Crush', 'Darkness Aura', 'Poisoned Dart', 'Mace', 'Healing Touch',
               'Create Whirlwind', 'Read Thoughts', 'Steam Breath', 'Fetid Cloud', 'Hand Crossbow', 'Quarterstaff',
               'Fey Charm', 'Enlarge', 'Invisibility', 'Blinding Breath (Recharge 6)', 'Talons', 'Gore', 'Stomp', 'Ram',
               'Web', 'Battleaxe', 'Touch', 'Greatsword', 'Engulf', 'Withering Touch', 'Etherealness', 'Horrifying Visage',
               'Possession (Recharge 6)', 'Ink Cloud', 'Bites', 'Blinding Spittle', 'Spear', 'Shield Bash',
               'Heavy Crossbow', 'Shortbow', 'Petrifying Breath', 'Illusory Appearance', 'Invisible Passage',
               'Spiked Bone Club', 'Spit Poison', 'Luring Song', 'Greatclub', 'Fork', 'Wall of Ice',
               'Tail Spike', 'Sword', 'Leadership', 'Sling', 'Fling', 'Lightning Storm', 'Intoxicating Touch',
               'Paralyzing Touch', 'Heavy Club', 'Spiked Shield', 'Fire Breath (Recharge 6)', 'Snake Hair', 'Harpoon',
               'Rotting Fist', 'Dreadful Glare', 'Death Glare', 'Horror Nimbus', 'Nightmare Haunting', 'Ethereal Stride',
               'Rapier', 'Tentacle Slam', 'Tail Stinger', 'Scare', 'Tendril', 'Reel', 'Smother', 'Antennae',
               'Strength Drain', 'Shriek', 'Slaying Longbow', 'Flying Sword', 'Life Drain', 'Heart Sight',
               'Steam Breath (Recharge 6)', 'Blood Drain', 'Slow', 'Lightning Strike', 'Charm', 'Draining Kiss',
               'Beaks', 'Animate Trees', 'Horn', 'Rotting Touch', 'Spores (Recharge 6)', 'Stunning Screech', 'Whelm',
               'Tusks', 'Maul', 'Shock', 'Create Specter', 'Stinger']

ROGUE_ATTACKS = ['Club', 'Fist', 'Dagger', 'Fist', 'Shortsword', 'Light Crossbow', 'Whip', 'Scimitar', 'Longbow', 'Haste', 'Poisoned Dart',
                 'Hand Crossbow', 'Quarterstaff', 'Shortbow', 'Sling', 'Rapier']

FIGHTER_ATTACKS = ['Club', 'Slam', 'Fist', 'Rock', 'Dagger', 'Shortsword', 'Light Crossbow', 'Warhammer',
                   'Longsword', 'Scimitar', 'Glaive', 'Greataxe', 'Morningstar',
                   'Javelin', 'Pike', 'Longbow', 'Haste', 'War Pick', 'Mace', 'Quarterstaff', 'Battleaxe', 'Greatsword', 'Spear',
                   'Shield Bash', 'Heavy Crossbow', 'Shortbow', 'Greatclub', 'Leadership', 'Fling', 'Heavy Club', 'Rapier', 'Slaying Longbow', 'Flying Sword',
                   'Slow']

BEAST_ATTACKS = ['Tentacle', 'Tail', 'Enslave', 'Bite', 'Claw', 'Frightful Presence', 'Acid Breath',
                 'Lightning Breath', 'Breath Weapons', 'Poison Breath', 'Fire Breath', 'Lair Actions',
                 'Cold Breath', 'Slam', 'Whirlwind', 'Change Shape', 'Roar', 'Acid Spray (Recharge 6)',
                 'Fist', 'Rock', 'Rake', 'Beak', 'Hurl Flame', 'Constrict', 'Swallow', 'Pseudopod', 'Tusk', 'Sting',
                 'Deadly Leap', 'Hooves', 'Horns', 'Pincer', 'Tentacles', 'Haste', 'Moan', 'Phantasms', 'Crush',
                 'Create Whirlwind', 'Steam Breath', 'Fetid Cloud', 'Fey Charm', 'Enlarge', 'Invisibility', 'Blinding Breath (Recharge 6)',
                 'Talons', 'Gore', 'Stomp', 'Ram', 'Web', 'Touch', 'Engulf', 'Withering Touch', 'Etherealness',
                 'Horrifying Visage', 'Possession (Recharge 6)', 'Ink Cloud', 'Bites', 'Blinding Spittle', 'Petrifying Breath',
                 'Illusory Appearance', 'Invisible Passage', 'Spit Poison', 'Luring Song', 'Frost Breath (Recharge 6)',
                 'Tail Spike', 'Fling', 'Lightning Storm', 'Intoxicating Touch', 'Paralyzing Touch', 'Fire Breath (Recharge 6)', 'Snake Hair', 'Rotting Fist',
                 'Dreadful Glare', 'Death Glare', 'Horror Nimbus', 'Ethereal Stride', 'Tentacle Slam', 'Tail Stinger', 'Scare', 'Tendril',
                 'Smother', 'Antennae', 'Strength Drain', 'Shriek', 'Life Drain', 'Heart Sight', 'Steam Breath (Recharge 6)',
                 'Blood Drain', 'Slow', 'Lightning Strike', 'Beaks', 'Horn', 'Rotting Touch', 'Spores (Recharge 6)', 'Stunning Screech',
                 'Whelm', 'Tusks', 'Maul', 'Shock', 'Stinger']

SPELLCASTER_ATTACKS = ['Enslave', 'Change Shape', 'Dagger', 'Teleport', 'Hurl Flame', 'Haste', 'Darkness Aura',
                       'Mace', 'Healing Touch', 'Create Whirlwind', 'Read Thoughts', 'Enlarge', 'Invisibility',
                       'Etherealness', 'Illusory Appearance', 'Invisible Passage', 'Wall of Ice', 'Lightning Storm', 'Ethereal Stride',
                       'Life Drain', 'Heart Sight', 'Slow', 'Lightning Strike', 'Charm', 'Draining Kiss', 'Animate Trees']

class NpcGenerator
  class << self
    def fetch_records
      @start = Time.now
      selected_monster_type = @new_npc.monster_type
      monster_types = Monster.all.group(:monster_type).count(:monster_type)
      monster_types[selected_monster_type] = 300
      weighted_monster_types = WeightedList[monster_types].sample(3)
      @weighted_resistances = WeightedList[Monster.where(monster_type: @new_npc.monster_type).group(:damage_resistances).count(:damage_resistances)]
      @weighted_immunities = WeightedList[Monster.where(monster_type: @new_npc.monster_type).group(:damage_immunities).count(:damage_immunities)]
      @weighted_vulnerabilities = WeightedList[Monster.where(monster_type: @new_npc.monster_type).group(:damage_vulnerabilities).count(:damage_vulnerabilities)]
      @weighted_conditions = WeightedList[Monster.where(monster_type: @new_npc.monster_type).group(:condition_immunities).count(:condition_immunities)]
      @weighted_languages = WeightedList[Monster.where(monster_type: @new_npc.monster_type).group(:languages).count(:languages)]
      @weighted_senses = WeightedList[Sense.joins(:monster).where(monster: {monster_type: @new_npc.monster_type}).group(:name, :value).count(:name)]
      @sense_chance = Monster.all.count.to_f / Sense.all.count.to_f
      @weighted_speeds = WeightedList[Speed.joins(:monster).where(monster: {monster_type: weighted_monster_types}).group(:name, :value).count(:name)]
      @monster_actions = MonsterAction.where.not(name: ['Multiattack'])
      @monster_type_actions = @monster_actions.joins(:monster).where(monster: {monster_type: weighted_monster_types})
      @special_abilities = SpecialAbility.joins(:monster).where(monster: {monster_type: weighted_monster_types}).where.not(name: ['Spellcasting'])
      @legendary_actions = LegendaryAction.joins(:monster).where(monster: {monster_type: weighted_monster_types})
      finish =  (Time.now - @start)
      puts finish
    end

    def quick_monster(monster_params, user)
      @new_npc = Monster.new(monster_params.except(:number_of_attacks, :archetype))
      fetch_records
      @archetype = monster_params[:archetype]
      @new_npc.slug = @new_npc.name.parameterize
      calculate_hd
      ability_score_order = get_ability_score_order
      spellcasting_ability = ability_score_order[0]
      cr_info = CrCalc.challenge_ratings[monster_params[:challenge_rating].to_sym]
      @new_npc.attack_bonus = cr_info[:attack_bonus]
      @new_npc.prof_bonus = cr_info[:prof_bonus]
      @new_npc.save_dc = calculate_save_dc(spellcasting_ability, cr_info[:save_dc])
      set_ability_scores(ability_score_order, 'Constitution')

      generate_actions(
        (cr_info[:damage_max] - cr_info[:damage_min]) / 2 + cr_info[:damage_min],
        monster_params[:number_of_attacks],
        CrCalc.cr_string_to_num(monster_params[:challenge_rating]),
        cr_info[:save_dc],
        spellcasting_ability
      )
      generate_special_abilities
      generate_stats

      @new_npc.slug = @new_npc.name.parameterize if user.nil?
      adjust_challenge_rating
      maybe_save_npc(user)
      finish =  (Time.now - @start)
      puts finish
      @new_npc
    end

    def generate_npc(monster_params, user)
      @new_npc = Monster.new(monster_params)
      calculate_hd
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
      when 'spellCasting'
        generate_spellcasting_desc(params[:monster_name], params[:action])
      else
        params[:action][:desc]
      end
    end

    def action_damage(damage_dice, npc_dam_bonus, action_desc)
      action_damage_bonus = if npc_dam_bonus > 0
                              "+ #{npc_dam_bonus}"
                            elsif npc_dam_bonus == 0
                              ''
                            else
                              "- #{npc_dam_bonus.abs}"
                            end
      base_damage = if damage_dice
                      parsed_dice = DndRules.parse_dice_string(damage_dice)
                      damage_dice_count = parsed_dice[:hit_dice_number]
                      damage_dice_value = parsed_dice[:hit_dice_value]
                      ((damage_dice_count * damage_dice_value + npc_dam_bonus) * 0.55).ceil
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

    def adjust_challenge_rating
      calculated_cr = CrCalc.calculate_challenge(@new_npc)
      if calculated_cr[:name] != @new_npc.challenge_rating =
        expected_cr = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
        current_cr = calculated_cr[:raw_cr]
        num_tries = 0
        if expected_cr > current_cr
          while expected_cr > current_cr && num_tries < 5
            adjust_hd(true)
            new_calc_cr = CrCalc.calculate_challenge(@new_npc)
            current_cr = new_calc_cr[:raw_cr]
            num_tries += 1
          end
        elsif expected_cr < current_cr
          while expected_cr < current_cr && num_tries < 5
            adjust_hd(false)
            new_calc_cr = CrCalc.calculate_challenge(@new_npc)
            current_cr = new_calc_cr[:raw_cr]
            num_tries += 1
          end
        end
        cr_string = CrCalc.cr_num_to_string(current_cr)
        cr_info = CrCalc.challenge_ratings[cr_string.to_sym]
        @new_npc.challenge_rating = cr_string
        @new_npc.xp = cr_info[:xp]
        @new_npc.prof_bonus = cr_info[:prof_bonus]
        @new_npc.save_dc = cr_info[:save_dc]
      end
    end

    def get_ability_score_order
      weighted_abilities = case @archetype
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
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      case cr_int
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
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      (cr_int / 5).round
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
        set_primary_ability(ability.to_s, ability_scores, index) unless  skip.to_s == ability.to_s
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

    def calculate_hd
      con_mod = DndRules.ability_score_modifier(@new_npc.constitution)
      hit_dice = @new_npc.hit_dice.scan(/\d+/)
      average_hp = hit_dice.last.to_f / 2 + 0.5
      current_hd = (@new_npc.hit_points / (average_hp + con_mod)).round
      @new_npc.hit_dice = "#{current_hd}d#{hit_dice.last}"
    end

    def adjust_hd(is_incrementing)
      con_mod = DndRules.ability_score_modifier(@new_npc.constitution)
      hit_dice = @new_npc.hit_dice.scan(/\d+/)
      average_hp = hit_dice.last.to_f / 2 + 0.5
      if is_incrementing
        @new_npc.hit_points += average_hp.floor
      else
        @new_npc.hit_points -= average_hp.ceil
      end
      current_hd = (@new_npc.hit_points / (average_hp + con_mod)).round
      @new_npc.hit_dice = "#{current_hd}d#{hit_dice.last}"
    end

    # Actions

    def generate_actions(damage_per_round = 10, number_of_attacks, challenge_rating, save_dc, primary_ability)
      attacks = []
      if @archetype == 'any'
        attacks << create_monster_type_actions(damage_per_round, number_of_attacks)
      else
        attacks << create_actions(damage_per_round, number_of_attacks)
      end
      attacks << create_spellcasting(challenge_rating, save_dc, primary_ability) if @archetype == 'spellcaster'
    end

    def create_multiattack(num_attacks, attack_names)
      damage_attacks = []
      attack_names.each do |attack_name|
        action = MonsterAction.find_by(name: attack_name)
        if action.desc.include? 'to hit'
          damage_attacks << action.name
        end
      end
      if num_attacks > 1
        if num_attacks == attack_names.count && damage_attacks.count > 1
          multi_desc = "The #{@new_npc.name} makes #{num_attacks} attacks: "
          attack_strings = damage_attacks.map do |action|
            "one with its #{action.downcase}"
          end
          multi_desc += attack_strings.to_sentence
          @new_npc.monster_actions << MonsterAction.new(name: 'Multiattack', desc: multi_desc)
        elsif damage_attacks.count == 1
          attack_name = damage_attacks[0]
          multi_desc = "The #{@new_npc.name} makes #{num_attacks} #{attack_name.downcase} attacks."
          multi_attack = MonsterAction.new(
            name: 'Multiattack',
            desc: multi_desc
          )
          @new_npc.monster_actions << multi_attack
        elsif  damage_attacks.count == 0
          return
        else
          multi_desc = "The #{@new_npc.name} makes "
          remaining_attacks = num_attacks
          attack_counts = []
          damage_attacks.each do |next_attack|
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

    def create_actions(damage_per_round, num_attacks, number_of_tries = 0)
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      max_num_actions = [num_attacks, 3].min
      monster_attacks = Hash[
        @monster_actions.map do |attack|
          attack_count = @monster_actions.where(name: attack.name).count
          monster_cr = [CrCalc.cr_string_to_num(attack.monster.challenge_rating), 0.125].max
          cr_diff = [(monster_cr - cr_int).abs, 1].max
          weight = (1 / cr_diff) * attack_count
          attack_options = case @archetype
                           when 'beast'
                             BEAST_ATTACKS
                           when 'rogue'
                             ROGUE_ATTACKS
                           when 'spellcaster'
                             SPELLCASTER_ATTACKS
                           when 'fighter'
                             FIGHTER_ATTACKS
                           else
                             @monster_actions.joins(:monster).where(monster: {monster_type: @new_npc.monster_type}).pluck(:name).uniq
                           end
          npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
          damage_dice = attack.desc[/([1-9]\d*)?d([1-9]\d*)/m]
          is_weapon = attack.desc[/Attack:\s.*to hit/]
          _, base_damage = action_damage(damage_dice, npc_dam_bonus, attack.desc)
          if attack_options.include?(attack.name) && is_weapon
            weight *= 4
          elsif attack_options.include?(attack.name)
            weight *= 2
          else
            weight = 0
          end
          attack_info = {name: attack.name, desc: attack.desc, monster: attack.monster.name, damage: base_damage + npc_dam_bonus}
          [attack_info, weight]
        end
      ].uniq do |action|
        action.first[:name]
      end
      actions = WeightedList[monster_attacks]

      num_actions = rand(1..max_num_actions)
      attacks = actions.sample(num_actions)
      damages = []
      attack_names = attacks.map do |attack|
        damages << attack[:damage]
        attack[:name]
      end
      current_dpr = damages.sum * num_attacks / attacks.count
      dpr_diff = damage_per_round - current_dpr
      dpr_diff_target = (damage_per_round * 0.5)
      if dpr_diff > dpr_diff_target && number_of_tries < MAX_RETRIES
        create_actions(damage_per_round, num_attacks, number_of_tries + 1)
      else
        create_multiattack(num_attacks, attack_names)
        attacks.each do |attack|
          @new_npc.monster_actions << MonsterAction.new(name: attack[:name], desc: adapt_action_desc(attack[:desc], attack[:monster].downcase))
        end
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

    def adapt_action_desc(action_desc, monster_name)
      damage_dice = action_desc[/([1-9]\d*)?d([1-9]\d*)/m]
      reach_string = /(?:to hit, )(.*)(?: Hit: )/.match(action_desc).captures if /(?:to hit, )(.*)(?: Hit: )/.match(action_desc)
      damage_type = /\) (.*) damage(,|\.)/.match(action_desc).captures if /\) (.*) damage(,|\.)/.match(action_desc)
      special_string = if /(?:damage(?:,|\.) )(.*)/.match(action_desc)
                         special = /(?:damage(?:,|\.) )(.*)/.match(action_desc).captures
                         special_string = special.first unless special.nil?
                         special_string.gsub(monster_name, @new_npc.name.downcase) unless special_string.nil?
                       end
      npc_dam_bonus = DndRules.ability_score_modifier(@new_npc.strength)
      action_damage_bonus, base_damage = action_damage(damage_dice, npc_dam_bonus, action_desc)
      result = if reach_string && damage_type
                 "Melee Weapon Attack: +#{@new_npc.attack_bonus} to hit, #{reach_string.first} Hit: #{base_damage} (#{damage_dice} #{action_damage_bonus}) #{damage_type.first} damage#{damage_type[1]} #{special_string}"
               else
                 action_desc.gsub(monster_name, @new_npc.name.downcase)
               end

      save_dcs = /(?:DC )([1-9]\d*)(?:\s)/.match(action_desc)
      unless save_dcs.nil?
        save_dcs.captures.each do |save_str|
          result = result.gsub(save_str, @new_npc.save_dc.to_s)
        end
      end
      result
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
            spell_str += "Cantrips (at will): #{spell_list[:spells].join(', ')}\n"
          else
            spell_str += "#{spell_list[:name]} (#{spell_list[:slots]} #{'slot'.pluralize(spell_list[:slots])}): #{spell_list[:spells].join(', ')}\n"
          end
        end
      end
      spell_str
    end

    def parse_action_with_weight(action)
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      monster_cr = [CrCalc.cr_string_to_num(action.monster.challenge_rating), 0.125].max
      weight = (1 / ([monster_cr - cr_int, 0.125].max).abs) * 100
      weight *= 5 if action.monster.monster_type == @new_npc.monster_type
      action_desc = replace_monster_name(action.desc, action.monster.name)
      save_dcs = /(?:DC )([1-9]\d*)(?:\s)/m.match(action_desc)
      unless save_dcs.nil?
        save_dcs.captures.each do |save_str|
          action_desc = action_desc.gsub(save_str, @new_npc.save_dc.to_s)
        end
      end
      attack_info = {name: action.name, desc: action_desc, monster: action.monster.name}
      [attack_info, weight]
    end

    def create_monster_type_actions(damage_per_round, number_of_attacks, number_of_tries = 0)
      dam_bonus = [DndRules.ability_score_modifier(@new_npc.strength), DndRules.ability_score_modifier(@new_npc.dexterity)].max
      max_num_actions = [number_of_attacks, 3].min
      monster_attacks = Hash[@monster_type_actions.map do |action|
        parse_action_with_weight(action)
      end].uniq do |action|
        action.first[:name]
      end
      num_actions = rand(1..max_num_actions)
      abilities = WeightedList[monster_attacks].sample(num_actions)
      damages = []
      abilities.each do |action|
        damage_info = /Hit: ([1-9]\d*)/.match(action[:desc])
        damage_strings = damage_info.captures unless damage_info.nil?
        unless damage_strings.nil?
          action_damages = damage_strings.map do |dam|
            dam.to_i + dam_bonus
          end
          damages << action_damages.sum
        end
      end
      attack_names = abilities.map do |action|
        action[:name]
      end
      current_dpr = damages.empty? ? 0 : damages.sum
      dpr_diff = damage_per_round - current_dpr
      dpr_diff_target = (damage_per_round * 0.5)
      if dpr_diff > dpr_diff_target && number_of_tries < MAX_RETRIES
        create_monster_type_actions(damage_per_round, number_of_attacks, number_of_tries + 1)
      else
        create_multiattack(number_of_attacks, attack_names)
        abilities.each do |attack|
          @new_npc.monster_actions << MonsterAction.new(name: attack[:name], desc: adapt_action_desc(attack[:desc], attack[:monster].downcase))
        end
      end
    end

    def generate_special_abilities
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      monster_attacks = Hash[@special_abilities.map do |action|
        parse_action_with_weight(action)
      end].uniq do |action|
        action.first[:name]
      end
      special_chance = cr_int / 30
      num_abilities = rand(1..(cr_int / 8).ceil)
      abilities = WeightedList[monster_attacks].sample(num_abilities)
      if rand < special_chance
        abilities.each do |ability|
          @new_npc.special_abilities << SpecialAbility.new(name: ability[:name], desc: ability[:desc])
        end
      end
    end

    def generate_legendary_actions
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      monster_attacks = Hash[@legendary_actions.map do |action|
        parse_action_with_weight(action)
      end].uniq do |action|
        action.first[:name]
      end
      special_chance = cr_int / 30
      num_abilities = rand(1..(cr_int / 8).ceil)
      abilities = WeightedList[monster_attacks].sample(num_abilities)
      if rand < special_chance
        abilities.each do |ability|
          @new_npc.legendary_actions << LegendaryAction.new(name: ability[:name], desc: ability[:desc])
        end
      end
    end

    def generate_senses
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      senses_chance = (cr_int / 30) * 5
      num_senses = rand(1..(cr_int / 8).ceil)
      senses = @weighted_senses.sample(num_senses)
      if rand < senses_chance
        sense_names = []
        senses.each do |sense|
          unless sense_names.include? sense[0]
            @new_npc.senses << Sense.new(name: sense[0], value: sense[1])
            sense_names << sense[0]
          end
        end
      end
    end

    def generate_speeds
      cr_int = CrCalc.cr_string_to_num(@new_npc.challenge_rating)
      num_senses = rand(1..(cr_int / 8).ceil)
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
      generate_legendary_actions
      generate_senses
      generate_speeds
    end

    def replace_monster_name(action_desc, monster_name)
      action_monster_name = monster_name.downcase
      action_name_parts = monster_name.downcase.split(' ')
      action_desc = action_desc.gsub(action_monster_name, @new_npc.name.downcase)
      action_name_parts.each do |name_part|
        action_desc = action_desc.gsub(name_part, @new_npc.name.downcase)
      end
      action_desc
    end
  end
end
