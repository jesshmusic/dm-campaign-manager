class CrCalc
  class << self
    def calculate_cr(params, use_simple_actions = false, archetype = 'fighter')
      monster = params[:params][:monster]
      attack_bonus = monster[:attack_bonus]
      challenge_rating = cr_for_npc(monster, attack_bonus, use_simple_actions, monster[:archetype])
      cr_data = challenge_ratings[challenge_rating.to_sym].as_json
      { name: challenge_rating, data: cr_data }
    end

    def challenge_ratings
      {
        '0': {
          'xp': 10,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 1,
          'hit_points_max': 6,
          'attack_bonus': 3,
          'damage_min': 0,
          'damage_max': 1,
          'save_dc': 13
        },
        '1/8': {
          'xp': 25,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 7,
          'hit_points_max': 35,
          'attack_bonus': 3,
          'damage_min': 2,
          'damage_max': 3,
          'save_dc': 13
        },
        '1/4': {
          'xp': 50,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 36,
          'hit_points_max': 49,
          'attack_bonus': 3,
          'damage_min': 4,
          'damage_max': 5,
          'save_dc': 13
        },
        '1/2': {
          'xp': 100,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 50,
          'hit_points_max': 70,
          'attack_bonus': 3,
          'damage_min': 6,
          'damage_max': 8,
          'save_dc': 13
        },
        '1': {
          'xp': 200,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 71,
          'hit_points_max': 85,
          'attack_bonus': 3,
          'damage_min': 9,
          'damage_max': 14,
          'save_dc': 13
        },
        '2': {
          'xp': 450,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 86,
          'hit_points_max': 100,
          'attack_bonus': 3,
          'damage_min': 15,
          'damage_max': 20,
          'save_dc': 13
        },
        '3': {
          'xp': 700,
          'prof_bonus': 2,
          'armor_class': 13,
          'hit_points_min': 101,
          'hit_points_max': 115,
          'attack_bonus': 4,
          'damage_min': 21,
          'damage_max': 26,
          'save_dc': 13
        },
        '4': {
          'xp': 1100,
          'prof_bonus': 2,
          'armor_class': 14,
          'hit_points_min': 116,
          'hit_points_max': 130,
          'attack_bonus': 5,
          'damage_min': 27,
          'damage_max': 32,
          'save_dc': 14
        },
        '5': {
          'xp': 1800,
          'prof_bonus': 3,
          'armor_class': 15,
          'hit_points_min': 131,
          'hit_points_max': 145,
          'attack_bonus': 6,
          'damage_min': 33,
          'damage_max': 38,
          'save_dc': 15
        },
        '6': {
          'xp': 2300,
          'prof_bonus': 3,
          'armor_class': 15,
          'hit_points_min': 146,
          'hit_points_max': 160,
          'attack_bonus': 6,
          'damage_min': 39,
          'damage_max': 44,
          'save_dc': 15
        },
        '7': {
          'xp': 2900,
          'prof_bonus': 3,
          'armor_class': 15,
          'hit_points_min': 161,
          'hit_points_max': 175,
          'attack_bonus': 6,
          'damage_min': 45,
          'damage_max': 50,
          'save_dc': 15
        },
        '8': {
          'xp': 3900,
          'prof_bonus': 3,
          'armor_class': 16,
          'hit_points_min': 176,
          'hit_points_max': 190,
          'attack_bonus': 7,
          'damage_min': 51,
          'damage_max': 56,
          'save_dc': 16
        },
        '9': {
          'xp': 5000,
          'prof_bonus': 4,
          'armor_class': 16,
          'hit_points_min': 191,
          'hit_points_max': 205,
          'attack_bonus': 7,
          'damage_min': 57,
          'damage_max': 62,
          'save_dc': 16
        },
        '10': {
          'xp': 5900,
          'prof_bonus': 4,
          'armor_class': 17,
          'hit_points_min': 206,
          'hit_points_max': 220,
          'attack_bonus': 7,
          'damage_min': 63,
          'damage_max': 68,
          'save_dc': 16
        },
        '11': {
          'xp': 7200,
          'prof_bonus': 4,
          'armor_class': 17,
          'hit_points_min': 221,
          'hit_points_max': 235,
          'attack_bonus': 8,
          'damage_min': 69,
          'damage_max': 74,
          'save_dc': 17
        },
        '12': {
          'xp': 8400,
          'prof_bonus': 4,
          'armor_class': 17,
          'hit_points_min': 236,
          'hit_points_max': 250,
          'attack_bonus': 8,
          'damage_min': 75,
          'damage_max': 80,
          'save_dc': 18
        },
        '13': {
          'xp': 10000,
          'prof_bonus': 5,
          'armor_class': 18,
          'hit_points_min': 251,
          'hit_points_max': 265,
          'attack_bonus': 8,
          'damage_min': 81,
          'damage_max': 86,
          'save_dc': 18
        },
        '14': {
          'xp': 11500,
          'prof_bonus': 5,
          'armor_class': 18,
          'hit_points_min': 266,
          'hit_points_max': 280,
          'attack_bonus': 8,
          'damage_min': 87,
          'damage_max': 92,
          'save_dc': 18
        },
        '15': {
          'xp': 13000,
          'prof_bonus': 5,
          'armor_class': 18,
          'hit_points_min': 281,
          'hit_points_max': 295,
          'attack_bonus': 8,
          'damage_min': 93,
          'damage_max': 98,
          'save_dc': 18
        },
        '16': {
          'xp': 15000,
          'prof_bonus': 5,
          'armor_class': 18,
          'hit_points_min': 296,
          'hit_points_max': 310,
          'attack_bonus': 9,
          'damage_min': 99,
          'damage_max': 104,
          'save_dc': 18
        },
        '17': {
          'xp': 18000,
          'prof_bonus': 6,
          'armor_class': 19,
          'hit_points_min': 311,
          'hit_points_max': 325,
          'attack_bonus': 10,
          'damage_min': 105,
          'damage_max': 110,
          'save_dc': 19
        },
        '18': {
          'xp': 20000,
          'prof_bonus': 6,
          'armor_class': 19,
          'hit_points_min': 326,
          'hit_points_max': 340,
          'attack_bonus': 10,
          'damage_min': 111,
          'damage_max': 116,
          'save_dc': 19
        },
        '19': {
          'xp': 22000,
          'prof_bonus': 6,
          'armor_class': 19,
          'hit_points_min': 341,
          'hit_points_max': 355,
          'attack_bonus': 10,
          'damage_min': 117,
          'damage_max': 122,
          'save_dc': 19
        },
        '20': {
          'xp': 25000,
          'prof_bonus': 6,
          'armor_class': 19,
          'hit_points_min': 356,
          'hit_points_max': 400,
          'attack_bonus': 10,
          'damage_min': 123,
          'damage_max': 140,
          'save_dc': 19
        },
        '21': {
          'xp': 33000,
          'prof_bonus': 7,
          'armor_class': 19,
          'hit_points_min': 401,
          'hit_points_max': 445,
          'attack_bonus': 11,
          'damage_min': 141,
          'damage_max': 158,
          'save_dc': 20
        },
        '22': {
          'xp': 41000,
          'prof_bonus': 7,
          'armor_class': 19,
          'hit_points_min': 446,
          'hit_points_max': 490,
          'attack_bonus': 11,
          'damage_min': 159,
          'damage_max': 176,
          'save_dc': 20
        },
        '23': {
          'xp': 50000,
          'prof_bonus': 7,
          'armor_class': 19,
          'hit_points_min': 491,
          'hit_points_max': 535,
          'attack_bonus': 11,
          'damage_min': 177,
          'damage_max': 194,
          'save_dc': 20
        },
        '24': {
          'xp': 62000,
          'prof_bonus': 7,
          'armor_class': 19,
          'hit_points_min': 536,
          'hit_points_max': 580,
          'attack_bonus': 11,
          'damage_min': 195,
          'damage_max': 212,
          'save_dc': 21
        },
        '25': {
          'xp': 75000,
          'prof_bonus': 8,
          'armor_class': 19,
          'hit_points_min': 581,
          'hit_points_max': 625,
          'attack_bonus': 12,
          'damage_min': 213,
          'damage_max': 230,
          'save_dc': 21
        },
        '26': {
          'xp': 90000,
          'prof_bonus': 8,
          'armor_class': 19,
          'hit_points_min': 626,
          'hit_points_max': 670,
          'attack_bonus': 12,
          'damage_min': 231,
          'damage_max': 248,
          'save_dc': 21
        },
        '27': {
          'xp': 105000,
          'prof_bonus': 8,
          'armor_class': 19,
          'hit_points_min': 671,
          'hit_points_max': 715,
          'attack_bonus': 13,
          'damage_min': 249,
          'damage_max': 266,
          'save_dc': 22
        },
        '28': {
          'xp': 120000,
          'prof_bonus': 8,
          'armor_class': 19,
          'hit_points_min': 716,
          'hit_points_max': 760,
          'attack_bonus': 13,
          'damage_min': 267,
          'damage_max': 284,
          'save_dc': 22
        },
        '29': {
          'xp': 135000,
          'prof_bonus': 9,
          'armor_class': 19,
          'hit_points_min': 760,
          'hit_points_max': 805,
          'attack_bonus': 13,
          'damage_min': 285,
          'damage_max': 302,
          'save_dc': 22
        },
        '30': {
          'xp': 155000,
          'prof_bonus': 9,
          'armor_class': 19,
          'hit_points_min': 805,
          'hit_points_max': 850,
          'attack_bonus': 14,
          'damage_min': 303,
          'damage_max': 320,
          'save_dc': 23
        }
      }
    end

    def armor_class_cr(armor_class)
      case armor_class
      when 0..12
        0.0
      when 13
        0.125
      when 14
        4.0
      when 15
        5.0
      when 16
        8.0
      when 17
        10.0
      when 18
        13.0
      else
        17.0
      end
    end

    def caster_level_for_cr(cr_float)
      challenge = cr_float.to_i
      [((challenge - 1) * 25) / 20, 20].min
    end

    def cr_for_attack_bonus(attack_bonus)
      (attack_bonus - 2) * 2
    end

    def cr_for_damage(damage, num_attacks = 1)
      damage = damage.to_i
      cr_result = 0
      challenge_ratings.each do |c_rating, info|
        min = info[:damage_min]
        max = info[:damage_max]
        cr_result = cr_string_to_num(c_rating.to_s) + num_attacks if (min..max).include? damage
      end
      cr_result
    end

    def cr_for_npc(monster, attack_bonus, use_simple_actions = false, archetype = 'fighter')

      def_cr = defensive_cr(monster)
      off_cr = use_simple_actions ? simple_offensive_cr(monster, archetype) : offensive_cr(monster, attack_bonus)
      # puts "#{npc.name} challenge rating calculation - proficiency CR: #{prof_cr} defense CR: #{def_cr} offense CR: #{off_cr}"
      cr_total = [def_cr, off_cr].inject(0, &:+)
      cr = (cr_total.to_f / 2.0)
      # puts "#{npc.name} CR value: #{cr}"
      case cr
      when 0...0.25
        '1/8'
      when 0.25...0.5
        '1/4'
      when 0.5...1.1
        '1/2'
      else
        cr.round.to_s
      end
    end

    def cr_for_save_dc(save_dc)
      case save_dc
      when 0..10
        0
      when 11..13
        0.125
      when 14
        4.0
      when 15
        5.0
      when 16
        8.0
      when 17
        11.0
      when 18
        14.0
      when 19
        19.0
      when 20
        26.0
      else
        30.0
      end
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
        "#{challenge_rating}"
      end
    end

    def defensive_cr(monster)
      def_cr_total = [hit_points_cr(monster[:hit_points]), armor_class_cr(monster[:armor_class].to_i)].inject(0, &:+)
      def_cr = (def_cr_total.to_f / 2.0)
      def_cr += monster[:conditions].count * 0.25 unless monster[:conditions].nil?
      def_cr += monster[:damage_immunities].count * 0.25 unless monster[:damage_immunities].nil?
      def_cr += monster[:damage_resistances].count * 0.125 unless monster[:damage_resistances].nil?
      def_cr -= monster[:damage_vulnerabilities].count * 0.25 unless monster[:damage_vulnerabilities].nil?
      def_cr
    end

    def calculate_spell_cr(spellcasting_desc)
      spellcasting_level = spellcasting_desc[/is a (.*?)(st|nd|rd|th) level spellcaster/m, 1].to_i
      spell_slots = DndRules.npc_spell_slots(spellcasting_level)
      spell_cr = 2
      spell_slots.each_with_index do |slot, index|
        if slot > 0
          spell_cr = (index + 1) * 2
        end
      end
      spell_cr
    end

    def proficiency_cr(prof_bonus)
      case prof_bonus
      when 0
        0.0
      when 1
        0.125
      when 2
        0.25
      when 3
        5.0
      when 4
        9.0
      when 5
        13.0
      when 6
        17.0
      when 7
        21.0
      when 8
        25.0
      else
        30.0
      end
    end

    def proficiency_for_cr(challenge_rating)
      return 2 if challenge_rating == '1/8' ||
        challenge_rating == '1/4' ||
        challenge_rating == '1/2' ||
        challenge_rating == '0'

      challenge = challenge_rating.to_i
      case challenge
      when 1..4
        2
      when 5..8
        3
      when 9..12
        4
      when 13..16
        5
      when 17..20
        6
      when 21..24
        7
      when 25..28
        8
      else
        9
      end
    end

    def xp_for_cr(challenge_rating)
      xp = {
        '0' => 10, '1/8' => 25, '1/4' => 50, '1/2' => 100, '1' => 200, '2' => 450, '3' => 700,
        '4' => 1100, '5' => 1800, '6' => 2300, '7' => 2900, '8' => 3900, '9' => 5000, '10' => 5900,
        '11' => 7200, '12' => 8400, '13' => 10_000, '14' => 11_500, '15' => 13_000, '16' => 15_000,
        '17' => 18_000, '18' => 20_000, '19' => 22_000, '20' => 25_000, '21' => 33_000, '22' => 41_000,
        '23' => 50_000, '24' => 62_000, '25' => 75_000, '26' => 90_000, '27' => 105_000, '28' => 120_000,
        '29' => 135_000, '30' => 155_000
      }[challenge_rating.to_s]
    end

    def offensive_cr(monster, attack_bonus)
      damages = []
      cr_for_spells = 0
      ability_cr = 1
      monster[:actions].each do |action_obj|
        action = action_obj[:data]
        if action[:damage]
          damage_obj = action[:damage]
          num_dice = damage_obj[:num_dice].to_i
          damage_die = damage_obj[:dice_value].to_i
          damage = (((damage_die / 2) + 1) * num_dice) + attack_bonus
          damages << damage * action[:num_attacks].to_i
        elsif action[:spell_casting]
          puts action[:spell_casting][:slots]
          cr_for_spells = (action[:spell_casting][:level].to_i / 2).to_i
          cr_for_spells += 1 unless action[:spell_casting][:slots][:third].to_i == 0
          cr_for_spells += 1 unless action[:spell_casting][:slots][:fourth].to_i == 0
          cr_for_spells += 2 unless action[:spell_casting][:slots][:fifth].to_i == 0
          cr_for_spells += 2 unless action[:spell_casting][:slots][:sixth].to_i == 0
          cr_for_spells += 3 unless action[:spell_casting][:slots][:seventh].to_i == 0
          cr_for_spells += 3 unless action[:spell_casting][:slots][:eighth].to_i == 0
          cr_for_spells += 5 unless action[:spell_casting][:slots][:ninth].to_i == 0
        else
          ability_cr += 1
        end
      end

      damage_per_round = damages.inject(0, :+)
      damage_cr = cr_for_damage(damage_per_round)
      attack_bonus_cr = cr_for_attack_bonus(attack_bonus)
      spell_save_cr = cr_for_save_dc(monster[:save_dc].to_i)
      if cr_for_spells > 0
        offensive_cr_total = [damage_cr, attack_bonus_cr, spell_save_cr, cr_for_spells, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 5.0)
      else
        offensive_cr_total = [damage_cr, attack_bonus_cr, spell_save_cr, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 4.0)
      end
    end

    def simple_offensive_cr(monster, archetype)
      damages = []
      cr_for_spells = 0
      ability_cr = 1
      num_attacks = 1
      num_attack_types = 0
      monster[:actions].each do |action_obj|
        damage_dice = action_obj[:desc][/([1-9]\d*)?d([1-9]\d*)/m]
        npc_dam_bonus = DndRules.ability_score_modifier(monster[:strength])
        _, base_damage = NpcGenerator.action_damage(damage_dice, npc_dam_bonus, action_obj[:desc])
        if action_obj[:name].downcase == 'multiattack'
          num_attacks_array = action_obj[:desc].scan(/\d+/).map(&:to_i)
          num_attacks = num_attacks_array.sum
        elsif base_damage > 0
          num_attack_types += 1
          damages << base_damage
        else
          ability_cr += 1
        end
      end
      monster[:special_abilities].each do |ability|
        if ability[:name].downcase == 'spellcasting'
          cr_for_spells = calculate_spell_cr(ability[:desc])
        else
          ability_cr += 1
        end
      end

      damage_per_round = damages.sum.to_f * num_attacks / num_attack_types
      damage_cr = damage_per_round ? cr_for_damage(damage_per_round, num_attacks) : 0
      attack_bonus_cr = cr_for_attack_bonus(monster[:attack_bonus])
      spell_save_cr = archetype == 'spellcaster' ? cr_for_save_dc(monster[:save_dc].to_i) : 0
      if archetype == 'spellcaster'
        offensive_cr_total = [spell_save_cr, cr_for_spells, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 3.0)
      else
        offensive_cr_total = [damage_cr, attack_bonus_cr, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 3.0)
      end
    end

    def hit_points_cr(hit_points)
      case hit_points
      when 0..6
        0.0
      when 7..35
        0.125
      when 36..49
        0.25
      when 50..70
        0.5
      else
        base_hp = hit_points - 70
        base_hp.to_f / 14
      end
    end

    def parse_action_desc(action)
      # desc = "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 3 (1d6 - 1) piercing damage. Or Ranged Weapon Attack: +5 to hit, range 30/120 ft., one target. Hit: 3 (1d6 - 1) piercing damage."
      # name = "Javelin"
      #
      # desc = "The New Monster makes 3 morningstar attacks."
      # name = "Multiattack"

      damage_str = action[:desc][/Hit: (.*?) /m, 1]
      if damage_str.nil? || damage_str.empty?
        5
      else
        damage_str.to_i
      end
    end
  end
end