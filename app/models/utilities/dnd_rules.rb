# frozen_string_literal: true

class DndRules
  class << self
    def abilities
      %w[Strength Dexterity Constitution Intelligence Wisdom Charisma]
    end

    def ability_score_modifier(ability_score)
      {
        1 => -5, 2 => -4, 3 => -4, 4 => -3, 5 => -3, 6 => -2, 7 => -2,
        8 => -1, 9 => -1, 10 => 0, 11 => 0, 12 => 1, 13 => 1, 14 => 2, 15 => 2,
        16 => 3, 17 => 3, 18 => 4, 19 => 4, 20 => 5, 21 => 5, 22 => 6, 23 => 6,
        24 => 7, 25 => 7, 26 => 8, 27 => 8, 28 => 9, 29 => 9, 30 => 10, 31 => 10
      }[ability_score]
    end

    def alignments
      [
        'Lawful Good', 'Lawful Neutral', 'Lawful Evil',
        'Neutral Good', 'Neutral', 'Neutral Evil',
        'Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil'
      ]
    end

    def alignments_non_evil
      [
        'Lawful Good', 'Lawful Neutral',
        'Neutral Good', 'Neutral',
        'Chaotic Good', 'Chaotic Neutral'
      ]
    end

    def alignments_non_good
      [
        'Lawful Neutral', 'Lawful Evil',
        'Neutral', 'Neutral Evil',
        'Chaotic Neutral', 'Chaotic Evil'
      ]
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

    def calculate_hp_and_hd (size, challenge_rating, constitution_bonus = 0, hit_points = nil)
      size = size.downcase
      hp_min = challenge_ratings[challenge_rating.to_sym][:hit_points_min]
      hp_max = challenge_ratings[challenge_rating.to_sym][:hit_points_max]

      if hit_points.nil?
        hp = rand(hp_min..hp_max)
      else
        hp = hit_points
      end
      { hit_points: hp, num_hit_die: hp / (hit_point_average_for_size[size.to_sym] + constitution_bonus) }
    end

    def caster_level_for_cr(cr_float)
      challenge = cr_float.to_i
      [((challenge - 1) * 19) / 20, 20].min
    end

    def challenge_rating_for_xp(xp)
      case xp.to_i
      when 0..449
        '1'
      when 450..699
        '2'
      when 700..1099
        '3'
      when 1100..1799
        '4'
      when 1800..2299
        '5'
      when 2300..2899
        '6'
      when 2900..3899
        '7'
      when 3900..4999
        '8'
      when 5000..5899
        '9'
      when 5900..7199
        '10'
      when 7200..8399
        '11'
      when 8400..9999
        '12'
      when 10_000..11_499
        '13'
      when 11_500..12_999
        '14'
      when 13_000..14_999
        '15'
      when 15_000..17_999
        '16'
      when 18_000..19_999
        '17'
      when 20_000..21_999
        '18'
      when 22_000..24_999
        '19'
      when 25_000..32_999
        '20'
      when 33_000..40_999
        '21'
      when 41_000..49_999
        '22'
      when 50_000..61_999
        '23'
      when 62_000..74_999
        '24'
      when 75_000..89_999
        '25'
      when 90_000..104_999
        '26'
      when 105_000..119_999
        '27'
      when 120_000..134_999
        '28'
      when 135_000..155_000
        '29'
      else
        '30'
      end
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

    def cr_for_attack_bonus(attack_bonus)
      (attack_bonus - 2) * 2
    end

    def cr_for_damage(damage)
      (damage.to_f / 10)
    end

    def cr_for_npc(monster, attack_bonus, use_simple_actions = false, is_caster = false)

      def_cr = defensive_cr(monster)
      off_cr = use_simple_actions ? simple_offensive_cr(monster, is_caster) : offensive_cr(monster, attack_bonus)
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
        13.0
      when 19
        17.0
      when 20
        21.0
      when 21
        24.0
      when 22
        27.0
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

    def hit_die_for_size
      {
        'tiny': 4,
        'small': 6,
        'medium': 8,
        'large': 10,
        'huge': 12,
        'gargantuan': 20
      }
    end

    def hit_point_average_for_size
      {
        'tiny': 2.5,
        'small': 3.5,
        'medium': 4.5,
        'large': 5.5,
        'huge': 6.5,
        'gargantuan': 10.5
      }
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

    def npc_spell_slots(caster_level)
      {
        1 => [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2 => [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3 => [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4 => [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5 => [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6 => [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7 => [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8 => [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9 => [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10 => [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11 => [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12 => [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13 => [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14 => [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15 => [4, 3, 3, 3, 2, 1, 1, 0, 0],
        16 => [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17 => [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18 => [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19 => [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20 => [4, 3, 3, 3, 3, 2, 2, 1, 1]
      }[caster_level]
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

    def simple_offensive_cr(monster, is_caster)
      damages = []
      cr_for_spells = 0
      ability_cr = 1
      num_attacks = 1
      num_attack_types = 0
      monster[:actions].each do |action_obj|
        if action_obj[:name].downcase == 'multiattack'
          num_attacks_array = action_obj[:desc].scan(/\d+/).map(&:to_i)
          num_attacks = num_attacks_array.sum
        elsif action_obj[:desc].include? 'to hit'
          num_attack_types += 1
          damages << parse_action_desc(action_obj)
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
      damage_cr = cr_for_damage(damage_per_round)
      attack_bonus_cr = cr_for_attack_bonus(monster[:attack_bonus])
      spell_save_cr = is_caster ? cr_for_save_dc(monster[:save_dc].to_i) : 0
      if is_caster
        offensive_cr_total = [damage_cr, attack_bonus_cr, spell_save_cr, cr_for_spells, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 5.0)
      else
        offensive_cr_total = [damage_cr, attack_bonus_cr, ability_cr].inject(0, &:+)
        (offensive_cr_total.to_f / 3.0)
      end
    end

    def parse_action_desc(action)
      # desc = "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 3 (1d6 - 1) piercing damage. Or Ranged Weapon Attack: +5 to hit, range 30/120 ft., one target. Hit: 3 (1d6 - 1) piercing damage."
      # name = "Javelin"
      #
      # desc = "The New Monster makes 3 morningstar attacks."
      # name = "Multiattack"

      damage_str = action[:desc][/Hit: (.*?) \(/m, 1]
      if damage_str.nil? || damage_str.empty?
        5
      else
        damage_str.to_i
      end
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

    def parse_dice_string(dice_string)
      # dice_string.gsub!(/\(.*?\)|\s/, '')
      subs = dice_string.scan(/([+-]|[0-9*!xder]+)/i).flatten
      hit_die = {
        hit_dice_number: 0,
        hit_dice_value: 0,
        hit_dice_modifier: 0
      }
      part = :hit_dice
      subs.each do |str|
        # puts str
        case str
        when '+'
          part = :add
        when '-', '&#8722;'
          part = :sub
        else
          if part == :hit_dice
            values = str.split('d')
            hit_die[:hit_dice_number] = values[0].to_i || 1
            hit_die[:hit_dice_value] = values[1].to_i
          elsif part == :sub
            hit_die[:hit_dice_modifier] = -str.to_i
          else
            hit_die[:hit_dice_modifier] = str.to_i
          end
        end
      end
      hit_die
    end

    def player_races
      [
        'Dragonborn',
        'Dwarf', 'Mountain Dwarf', 'Hill Dwarf',
        'Elf', 'High Elf', 'Wood Elf',
        'Gnome', 'Rock Gnome', 'Forest Gnome',
        'Half-orc', 'Half-elf',
        'Halfling', 'Stout Halfling', 'Lightfoot Halfling',
        'Human',
        'Tiefling'
      ]
    end

    def proficiency_bonus_for_level(level)
      case level
      when 0..4
        2
      when 5..8
        3
      when 9..12
        4
      when 13..16
        5
      else
        6
      end
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

    def proficiency_for_hit_points(hit_points)
      case hit_points
      when 1..130
        2
      when 131..190
        3
      when 191..250
        4
      when 251..310
        5
      when 311..400
        6
      when 401..580
        7
      when 581..760
        8
      else
        9
      end
    end

    def race_values
      {
        'dragonborn': 'Dragonborn',
        'dwarf': 'Dwarf',
        'dwarf_hill': 'Dwarf (hill)',
        'dwarf_mountain': 'Dwarf (mountain)',
        'elf': 'Elf',
        'elf_high': 'Elf (high)',
        'elf_wood': 'Elf (wood)',
        'gnome': 'Gnome',
        'half_elf': 'Half-elf',
        'half_orc': 'Half-orc',
        'halfling': 'Halfling',
        'halfling_lightfoot': 'Halfling (lightfoot)',
        'halfling_stout': 'Halfling (stout)',
        'human': 'Human',
        'tiefling': 'Tiefling'
      }
    end

    def random_alignment
      alignments.sample
    end

    def random_race
      player_races.sample
    end

    def roll_dice(num_dice, dice_value)
      result = 0
      (1..num_dice).each do
        result += rand(1..dice_value)
      end
      result
    end

    def senses
      {
        'blindsight': 'Blind Sight',
        'darkvision': 'Dark Vision',
        'passive_perception': 'Passive Perception',
        'tremorsense': 'Tremor Sense',
        'truesight': 'Blind Sight'
      }
    end

    def skills
      [
        'Skill: Animal Handling',
        'Skill: Survival',
        'Skill: Acrobatics',
        'Skill: Athletics',
        'Skill: Perception',
        'Skill: Performance',
        'Skill: Sleight of Hand',
        'Skill: Stealth',
        'Skill: Persuasion',
        'Skill: Deception',
        'Skill: Intimidation',
        'Skill: Nature',
        'Skill: Arcana',
        'Skill: History',
        'Skill: Insight',
        'Skill: Investigation',
        'Skill: Medicine',
        'Skill: Religion'
      ]
    end

    def skill_from_profs(profs, exclude_list)
      profs_list = profs - exclude_list
      prof = profs_list.sample
      skill_name = prof.name
      skills = {
        'Skill: Animal Handling' => 'wisdom',
        'Skill: Survival' => 'wisdom',
        'Skill: Acrobatics' => 'dexterity',
        'Skill: Athletics' => 'strength',
        'Skill: Perception' => 'wisdom',
        'Skill: Performance' => 'charisma',
        'Skill: Sleight of Hand' => 'dexterity',
        'Skill: Stealth' => 'dexterity',
        'Skill: Persuasion' => 'charisma',
        'Skill: Deception' => 'charisma',
        'Skill: Intimidation' => 'charisma',
        'Skill: Nature' => 'intelligence',
        'Skill: Arcana' => 'intelligence',
        'Skill: History' => 'intelligence',
        'Skill: Insight' => 'wisdom',
        'Skill: Investigation' => 'intelligence',
        'Skill: Medicine' => 'wisdom',
        'Skill: Religion' => 'intelligence'
      }
      skill = skills[skill_name.to_s]
      skill_name.slice! 'Skill: '
      skill_result = {
        name: skill_name,
        ability: skill,
        new_exclude: prof
      }
      puts "Skill: #{skill_result}"
      skill_result
    end

    def spell_attack_bonus(proficiency_bonus, dnd_class, char)
      case dnd_class.name
      when 'Bard', 'Paladin', 'Sorcerer', 'Warlock'
        proficiency_bonus + DndRules.ability_score_modifier(char.charisma)
      when 'Cleric', 'Druid', 'Ranger'
        proficiency_bonus + DndRules.ability_score_modifier(char.wisdom)
      when 'Wizard'
        proficiency_bonus + DndRules.ability_score_modifier(char.intelligence)
      else
        0
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
