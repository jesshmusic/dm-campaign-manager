class CrCalc
  class << self
    # @param [Monster] monster
    def calculate_challenge(monster, target_cr = monster.challenge_rating)
      damage_per_round = [monster.damage_per_round.floor, 320].min
      attack_bonus = monster.attack_bonus
      armor_class = monster.armor_class
      hit_points = monster.hit_points
      damage_per_round, attack_bonus, armor_class, hit_points = trait_modifier(monster, target_cr, damage_per_round, attack_bonus, armor_class,
                                                                               hit_points)
      def_cr = get_defensive_cr(monster, target_cr, armor_class, hit_points)
      off_cr = get_offensive_cr(monster, damage_per_round, attack_bonus)
      raw_cr = [((def_cr + off_cr) / 2).ceil, 30].min
      final_cr = cr_num_to_string(raw_cr)
      cr_data = challenge_ratings[final_cr.to_sym].as_json
      { name: final_cr, raw_cr: raw_cr, data: cr_data }
    end

    # @param [Monster] monster
    # @return [Float | Integer]
    def get_defensive_cr(monster, target_cr, armor_class, hit_points)
      armor_class += 2 if monster.num_saving_throws > 2 && monster.num_saving_throws < 5
      armor_class += 4 if monster.num_saving_throws > 4
      monster.speeds.each do |speed|
        armor_class += 2 if speed.name.downcase == 'fly'
      end

      resistance_multiplier = calculate_resistances(monster, target_cr)
      immunity_multiplier = calculate_immunities(monster, target_cr)
      num_vulnerabilities = calculate_vulnerabilities(monster)

      resist_immune_multiplier = [immunity_multiplier, resistance_multiplier].max
      hit_points *= resist_immune_multiplier
      hit_points /= 2 if num_vulnerabilities > 2

      hit_points_cr, assumed_ac = ac_for_hit_points(hit_points)
      defensive_cr = calculate_cr_modifier(armor_class, assumed_ac, hit_points_cr)
      defensive_cr = 0.0 if defensive_cr.negative?
      defensive_cr
    end

    def get_offensive_cr(monster, damage_per_round, attack_bonus)
      damage_cr, assumed_attack_bonus, assumed_dc = cr_for_damage(damage_per_round)
      off_cr = if monster.is_caster
                 calculate_cr_modifier(monster.save_dc, assumed_dc, damage_cr)
               else
                 calculate_cr_modifier(attack_bonus, assumed_attack_bonus, damage_cr)
               end
      [off_cr, 0.0].max
    end

    def calculate_cr_diff(diff_num, cr_index)
      diff_num = (diff_num / 2).floor if diff_num.positive?
      diff_num = (diff_num / 2).ceil if diff_num.negative?
      diff_num = cr_index - diff_num
      diff_num = 0 if diff_num.negative?
      diff_num = 30 if diff_num > 30
      diff_num
    end

    def challenge_ratings
      {
        '0': {
          xp: 10,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 1,
          hit_points_max: 6,
          attack_bonus: 3,
          damage_min: 0,
          damage_max: 1,
          save_dc: 13
        },
        '1/8': {
          xp: 25,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 7,
          hit_points_max: 35,
          attack_bonus: 3,
          damage_min: 2,
          damage_max: 3,
          save_dc: 13
        },
        '1/4': {
          xp: 50,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 36,
          hit_points_max: 49,
          attack_bonus: 3,
          damage_min: 4,
          damage_max: 5,
          save_dc: 13
        },
        '1/2': {
          xp: 100,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 50,
          hit_points_max: 70,
          attack_bonus: 3,
          damage_min: 6,
          damage_max: 8,
          save_dc: 13
        },
        '1': {
          xp: 200,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 71,
          hit_points_max: 85,
          attack_bonus: 3,
          damage_min: 9,
          damage_max: 14,
          save_dc: 13
        },
        '2': {
          xp: 450,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 86,
          hit_points_max: 100,
          attack_bonus: 3,
          damage_min: 15,
          damage_max: 20,
          save_dc: 13
        },
        '3': {
          xp: 700,
          prof_bonus: 2,
          armor_class: 13,
          hit_points_min: 101,
          hit_points_max: 115,
          attack_bonus: 4,
          damage_min: 21,
          damage_max: 26,
          save_dc: 13
        },
        '4': {
          xp: 1100,
          prof_bonus: 2,
          armor_class: 14,
          hit_points_min: 116,
          hit_points_max: 130,
          attack_bonus: 5,
          damage_min: 27,
          damage_max: 32,
          save_dc: 14
        },
        '5': {
          xp: 1800,
          prof_bonus: 3,
          armor_class: 15,
          hit_points_min: 131,
          hit_points_max: 145,
          attack_bonus: 6,
          damage_min: 33,
          damage_max: 38,
          save_dc: 15
        },
        '6': {
          xp: 2300,
          prof_bonus: 3,
          armor_class: 15,
          hit_points_min: 146,
          hit_points_max: 160,
          attack_bonus: 6,
          damage_min: 39,
          damage_max: 44,
          save_dc: 15
        },
        '7': {
          xp: 2900,
          prof_bonus: 3,
          armor_class: 15,
          hit_points_min: 161,
          hit_points_max: 175,
          attack_bonus: 6,
          damage_min: 45,
          damage_max: 50,
          save_dc: 15
        },
        '8': {
          xp: 3900,
          prof_bonus: 3,
          armor_class: 16,
          hit_points_min: 176,
          hit_points_max: 190,
          attack_bonus: 7,
          damage_min: 51,
          damage_max: 56,
          save_dc: 16
        },
        '9': {
          xp: 5000,
          prof_bonus: 4,
          armor_class: 16,
          hit_points_min: 191,
          hit_points_max: 205,
          attack_bonus: 7,
          damage_min: 57,
          damage_max: 62,
          save_dc: 16
        },
        '10': {
          xp: 5900,
          prof_bonus: 4,
          armor_class: 17,
          hit_points_min: 206,
          hit_points_max: 220,
          attack_bonus: 7,
          damage_min: 63,
          damage_max: 68,
          save_dc: 16
        },
        '11': {
          xp: 7200,
          prof_bonus: 4,
          armor_class: 17,
          hit_points_min: 221,
          hit_points_max: 235,
          attack_bonus: 8,
          damage_min: 69,
          damage_max: 74,
          save_dc: 17
        },
        '12': {
          xp: 8400,
          prof_bonus: 4,
          armor_class: 17,
          hit_points_min: 236,
          hit_points_max: 250,
          attack_bonus: 8,
          damage_min: 75,
          damage_max: 80,
          save_dc: 18
        },
        '13': {
          xp: 10_000,
          prof_bonus: 5,
          armor_class: 18,
          hit_points_min: 251,
          hit_points_max: 265,
          attack_bonus: 8,
          damage_min: 81,
          damage_max: 86,
          save_dc: 18
        },
        '14': {
          xp: 11_500,
          prof_bonus: 5,
          armor_class: 18,
          hit_points_min: 266,
          hit_points_max: 280,
          attack_bonus: 8,
          damage_min: 87,
          damage_max: 92,
          save_dc: 18
        },
        '15': {
          xp: 13_000,
          prof_bonus: 5,
          armor_class: 18,
          hit_points_min: 281,
          hit_points_max: 295,
          attack_bonus: 8,
          damage_min: 93,
          damage_max: 98,
          save_dc: 18
        },
        '16': {
          xp: 15_000,
          prof_bonus: 5,
          armor_class: 18,
          hit_points_min: 296,
          hit_points_max: 310,
          attack_bonus: 9,
          damage_min: 99,
          damage_max: 104,
          save_dc: 18
        },
        '17': {
          xp: 18_000,
          prof_bonus: 6,
          armor_class: 19,
          hit_points_min: 311,
          hit_points_max: 325,
          attack_bonus: 10,
          damage_min: 105,
          damage_max: 110,
          save_dc: 19
        },
        '18': {
          xp: 20_000,
          prof_bonus: 6,
          armor_class: 19,
          hit_points_min: 326,
          hit_points_max: 340,
          attack_bonus: 10,
          damage_min: 111,
          damage_max: 116,
          save_dc: 19
        },
        '19': {
          xp: 22_000,
          prof_bonus: 6,
          armor_class: 19,
          hit_points_min: 341,
          hit_points_max: 355,
          attack_bonus: 10,
          damage_min: 117,
          damage_max: 122,
          save_dc: 19
        },
        '20': {
          xp: 25_000,
          prof_bonus: 6,
          armor_class: 19,
          hit_points_min: 356,
          hit_points_max: 400,
          attack_bonus: 10,
          damage_min: 123,
          damage_max: 140,
          save_dc: 19
        },
        '21': {
          xp: 33_000,
          prof_bonus: 7,
          armor_class: 19,
          hit_points_min: 401,
          hit_points_max: 445,
          attack_bonus: 11,
          damage_min: 141,
          damage_max: 158,
          save_dc: 20
        },
        '22': {
          xp: 41_000,
          prof_bonus: 7,
          armor_class: 19,
          hit_points_min: 446,
          hit_points_max: 490,
          attack_bonus: 11,
          damage_min: 159,
          damage_max: 176,
          save_dc: 20
        },
        '23': {
          xp: 50_000,
          prof_bonus: 7,
          armor_class: 19,
          hit_points_min: 491,
          hit_points_max: 535,
          attack_bonus: 11,
          damage_min: 177,
          damage_max: 194,
          save_dc: 20
        },
        '24': {
          xp: 62_000,
          prof_bonus: 7,
          armor_class: 19,
          hit_points_min: 536,
          hit_points_max: 580,
          attack_bonus: 11,
          damage_min: 195,
          damage_max: 212,
          save_dc: 21
        },
        '25': {
          xp: 75_000,
          prof_bonus: 8,
          armor_class: 19,
          hit_points_min: 581,
          hit_points_max: 625,
          attack_bonus: 12,
          damage_min: 213,
          damage_max: 230,
          save_dc: 21
        },
        '26': {
          xp: 90_000,
          prof_bonus: 8,
          armor_class: 19,
          hit_points_min: 626,
          hit_points_max: 670,
          attack_bonus: 12,
          damage_min: 231,
          damage_max: 248,
          save_dc: 21
        },
        '27': {
          xp: 105_000,
          prof_bonus: 8,
          armor_class: 19,
          hit_points_min: 671,
          hit_points_max: 715,
          attack_bonus: 13,
          damage_min: 249,
          damage_max: 266,
          save_dc: 22
        },
        '28': {
          xp: 120_000,
          prof_bonus: 8,
          armor_class: 19,
          hit_points_min: 716,
          hit_points_max: 760,
          attack_bonus: 13,
          damage_min: 267,
          damage_max: 284,
          save_dc: 22
        },
        '29': {
          xp: 135_000,
          prof_bonus: 9,
          armor_class: 19,
          hit_points_min: 760,
          hit_points_max: 805,
          attack_bonus: 13,
          damage_min: 285,
          damage_max: 302,
          save_dc: 22
        },
        '30': {
          xp: 155_000,
          prof_bonus: 9,
          armor_class: 19,
          hit_points_min: 805,
          hit_points_max: 850,
          attack_bonus: 14,
          damage_min: 303,
          damage_max: 320,
          save_dc: 23
        }
      }
    end

    def caster_level_for_cr(cr_float)
      [[cr_float.to_i, 1].max, 30].min
    end

    def cr_string_to_num(challenge_rating)
      case challenge_rating
      when '1/8'
        0.125
      when '1/4'
        0.25
      when '1/2'
        0.5
      else
        challenge_rating.to_f
      end
    end

    def cr_num_to_string(challenge_rating)
      case challenge_rating
      when 0.125
        '1/8'
      when 0.25
        '1/4'
      when 0.5
        '1/2'
      else
        challenge_rating.to_s
      end
    end

    def proficiency_for_cr(challenge_rating)
      challenge_ratings[challenge_rating.to_s.to_sym]&.dig(:prof_bonus) || 2
    end

    def xp_for_cr(challenge_rating)
      challenge_ratings[challenge_rating.to_s.to_sym]&.dig(:xp)
    end

    private

    # Adjusts CR based on difference between actual and expected values
    # Per DMG: For every 2 points difference, CR changes by 1 step
    def calculate_cr_modifier(value, assumed, incoming_cr)
      diff = value - assumed
      return incoming_cr if diff.zero?

      n_steps = (diff.abs / 2).ceil
      direction = diff.positive? ? 1 : -1

      n_steps.times do
        step_size = cr_step_size(incoming_cr)
        incoming_cr += step_size * direction
      end

      incoming_cr
    end

    # Returns the appropriate step size for fractional CRs
    def cr_step_size(cr)
      case cr
      when 0...0.25 then 0.125
      when 0.25...0.5 then 0.25
      when 0.5...1 then 0.5
      else 1
      end
    end

    def trait_modifier(monster, target_cr, damage_per_round, attack_bonus, armor_class, hit_points)
      challenge = cr_string_to_num(target_cr)
      monster.special_abilities.each do |special_ability|
        if special_ability == 'Aggressive'
          damage_per_round += 2
        elsif special_ability == 'Ambusher'
          attack_bonus += 2
        elsif special_ability == 'Assassinate'
          damage_per_round += 4 * challenge
        elsif special_ability == 'Avoidance'
          armor_class += 1
        elsif ['Blood Frenzy', 'Berserk'].include?(special_ability)
          attack_bonus += 4
        elsif special_ability == 'Damage Transfer'
          hit_points += hit_points
          damage_per_round *= 1.5
        elsif special_ability == 'Evasion'
          armor_class += 1
        elsif special_ability == 'Fiendish Blessing'
          armor_class += DndRules.ability_score_modifier(monster.charisma)
        elsif ['Freedom of Movement', 'Stench'].include?(special_ability)
          armor_class += 1
        elsif special_ability == 'Frightful Presence'
          hit_points *= 1.25
        elsif ['Invisibility', 'Magic Resistance', 'Superior Invisibility'].include?(special_ability)
          armor_class += 2
        elsif special_ability == 'Nimble Escape'
          armor_class += 4
          attack_bonus += 4
        elsif special_ability == 'Pack Tactics'
          attack_bonus += 1
        elsif special_ability == 'Psychic Defense'
          armor_class += DndRules.ability_score_modifier(monster.wisdom)
        elsif special_ability == 'Rampage'
          damage_per_round += 2
        elsif special_ability == 'Relentless'
          mod_cr = challenge.floor
          relentless_mod = case mod_cr
                           when 1..4 then 7
                           when 5..9 then 14
                           when 10..15 then 21
                           else mod_cr >= 16 ? 28 : 0
                           end
          hit_points += relentless_mod
        elsif special_ability == 'Shadow Stealth'
          armor_class += 4
        elsif special_ability.name == 'Spellcasting'
          action_desc = special_ability.desc
          scanned_casting = action_desc.scan(/(([1-9]\d*)(?:th)|([1-9]\d*)(?:rd)|([1-9]\d*)(?:st)|([1-9]\d*)(?:nd)) Level \([1-9]/m)
          if scanned_casting&.many?
            max_spell_level = scanned_casting.last.first.to_i
            damage_per_round += max_spell_level * 2
            armor_class += 3
          else
            damage_per_round += 3
            armor_class += 2
          end
        else
          hit_points += challenge / 2
          damage_per_round += challenge / 2
        end
      end
      [damage_per_round, attack_bonus, armor_class, hit_points]
    end

    # Check if damage type is physical (bludgeoning, piercing, slashing, or nonmagical)
    def physical_damage_type?(dam_type)
      %w[bludgeoning piercing slashing nonmagical].include?(dam_type.to_s.downcase)
    end

    # 2024 rules: Only physical damage resistances affect HP multiplier
    # Multipliers based on number of physical resistance types and CR
    def calculate_resistance_multiplier(monster, target_cr)
      physical_resistances = monster.damage_resistances.count { |r| physical_damage_type?(r) }
      return 1.0 if physical_resistances.zero?

      # Based on 2024 analysis: physical resistances provide significant HP multiplier
      multiplier_by_cr(target_cr, physical_resistances <= 2)
    end

    # Returns HP multiplier based on CR tier
    # few_effects: true for 1-2 resistances, false for 3+
    def multiplier_by_cr(target_cr, few_effects)
      if target_cr < 11
        few_effects ? 1.5 : 2.0
      elsif target_cr < 17
        few_effects ? 1.25 : 1.5
      else
        few_effects ? 1.1 : 1.25
      end
    end

    # 2024 rules: Only 3+ immunities significantly affect HP
    # Single immunities have minimal impact
    def calculate_immunity_multiplier(monster, target_cr)
      num_immunities = monster.damage_immunities.count

      return 1.0 if num_immunities < 3

      # 3+ immunities warrant HP reduction in CR calculation
      target_cr <= 15 ? 1.15 : 1.25
    end

    # Legacy method for backward compatibility - now delegates to new methods
    def calculate_resistances(monster, target_cr)
      calculate_resistance_multiplier(monster, target_cr)
    end

    # Legacy method for backward compatibility - now delegates to new methods
    def calculate_immunities(monster, target_cr)
      calculate_immunity_multiplier(monster, target_cr)
    end

    # Count vulnerabilities - physical vulnerabilities are more significant
    def calculate_vulnerabilities(monster)
      physical = monster.damage_vulnerabilities.count { |v| physical_damage_type?(v) }
      non_physical = monster.damage_vulnerabilities.count { |v| !physical_damage_type?(v) }
      (physical * 2) + non_physical
    end

    def cr_for_damage(damage_per_round)
      damage_cr = 0.0
      assumed_attack_bonus = 0
      assumed_dc = 10
      challenge_ratings.each do |key, cr_info|
        next unless damage_per_round.between?(cr_info[:damage_min], cr_info[:damage_max])

        damage_cr = cr_string_to_num(key.to_s)
        assumed_attack_bonus = cr_info[:attack_bonus]
        assumed_dc = cr_info[:save_dc]
        break
      end
      [damage_cr, assumed_attack_bonus, assumed_dc]
    end

    def ac_for_hit_points(hit_points)
      hit_point_cr = 0.0
      assumed_ac = 0
      challenge_ratings.each do |key, cr_info|
        next unless hit_points.between?(cr_info[:hit_points_min], cr_info[:hit_points_max])

        hit_point_cr = cr_string_to_num(key.to_s)
        assumed_ac = cr_info[:armor_class]
        break
      end
      [hit_point_cr, assumed_ac]
    end
  end
end
