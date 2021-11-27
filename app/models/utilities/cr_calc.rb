class CrCalc
  class << self
    # @param [Monster] monster
    def calculate_challenge(monster)
      def_cr = get_defensive_cr(monster)
      off_cr = get_offensive_cr(monster)
      raw_cr = (def_cr + off_cr) / 2
      final_cr = cr_num_to_string(raw_cr)
      cr_data = challenge_ratings[final_cr.to_sym].as_json
      { name: final_cr, raw_cr: raw_cr, data: cr_data }
    end

    # @param [Monster] monster
    # @return [Float | Integer]
    def get_defensive_cr(monster)
      expected_cr = cr_string_to_num(monster.challenge_rating)
      hit_points = monster.hit_points
      hit_points *= 0.5 if monster.vulnerabilities.count > 0
      if monster.resistances && monster.resistances.count > 0
        hit_points *= 2 if (0..4).include? expected_cr
        hit_points *= 1.5 if (5..10).include? expected_cr
        hit_points *= 1.25 if (11..16).include? expected_cr
      end
      if monster.immunities && monster.immunities.count > 0
        hit_points *= 2 if (0..10).include? expected_cr
        hit_points *= 1.5 if (11..16).include? expected_cr
        hit_points *= 1.25 if expected_cr >= 17
      end

      hit_points = hit_points.floor > 850 ? 850 : hit_points.floor

      def_cr = -1.0

      challenge_ratings.each_with_index do |c_rating, index|
        cr_info = c_rating[1]
        if (cr_info[:hit_points_min]..cr_info[:hit_points_max]).include? hit_points
          def_diff = cr_info[:armor_class] - monster.armor_class
          def_cr = calculate_cr_diff(def_diff, index)
        end
      end
      def_cr = 0 if def_cr < 0
      def_cr
    end

    def get_offensive_cr(monster)
      off_cr = -1
      damage_per_round = monster.damage_per_round.floor > 320 ? 320 : monster.damage_per_round.floor
      challenge_ratings.each_with_index do |c_rating, index|
        cr_info = c_rating[1]
        if (cr_info[:damage_min]..cr_info[:damage_max]).include? damage_per_round
          adjuster = cr_info[:attack_bonus]
          adjuster = cr_info[:save_dc] if monster.is_caster
          attack_diff = adjuster - monster.attack_bonus
          off_cr = calculate_cr_diff(attack_diff, index)
        end
      end
      off_cr = 0 if off_cr < 0
      off_cr
    end

    def calculate_cr_diff(diff_num, cr_index)
      diff_num = (diff_num / 2).floor if diff_num > 0
      diff_num = (diff_num / 2).ceil if diff_num < 0
      diff_num = cr_index - diff_num
      diff_num = 0 if diff_num < 0
      diff_num = 30 if diff_num > 30
      diff_num
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

    def caster_level_for_cr(cr_float)
      challenge = cr_float.to_i
      [((challenge - 1) * 25) / 20, 20].min
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
  end
end