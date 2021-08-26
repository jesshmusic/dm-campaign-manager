# frozen_string_literal: true

class DndRules
  class << self
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

    def abilities
      %w[Strength Dexterity Constitution Intelligence Wisdom Charisma]
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

    def race_values
      {
        "dragonborn": "Dragonborn",
        "dwarf": "Dwarf",
        "dwarf_hill": "Dwarf (hill)",
        "dwarf_mountain": "Dwarf (mountain)",
        "elf": "Elf",
        "elf_high": "Elf (high)",
        "elf_wood": "Elf (wood)",
        "gnome": "Gnome",
        "half_elf": "Half-elf",
        "half_orc": "Half-orc",
        "halfling": "Halfling",
        "halfling_lightfoot": "Halfling (lightfoot)",
        "halfling_stout": "Halfling (stout)",
        "human": "Human",
        "tiefling": "Tiefling"
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

    def hit_die_for_size
      {
        "tiny": 4,
        "small": 6,
        "medium": 8,
        "large": 10,
        "huge": 12,
        "gargantuan": 20
      }
    end

    def hit_point_average_for_size
      {
        "tiny": 2.5,
        "small": 3.5,
        "medium": 4.5,
        "large": 5.5,
        "huge": 6.5,
        "gargantuan": 10.5
      }
    end

    def num_hit_die_for_size (size, challenge_rating, constitution_bonus = 0, hit_points = nil)
      size = size.downcase
      hp_min = challenge_ratings[challenge_rating.to_sym][:hit_points_min]
      hp_max = challenge_ratings[challenge_rating.to_sym][:hit_points_max]

      if hit_points.nil?
        hp = rand(hp_min..hp_max)
      else
        hp = hit_points
      end
      {hit_points: hp, num_hit_die: hp / (hit_point_average_for_size[size.to_sym] + constitution_bonus)}
    end

    def challenge_ratings
      {
        "0": {
          "xp": 10,
          "prof_bonus": 2,
          "armor_class": 11,
          "hit_points_min": 1,
          "hit_points_max": 6,
          "attack_bonus": 3,
          "damage_min": 0,
          "damage_max": 1,
          "save_dc": 13
        },
        "1": {
          "xp": 200,
          "prof_bonus": 2,
          "armor_class": 14,
          "hit_points_min": 20,
          "hit_points_max": 40,
          "attack_bonus": 3,
          "damage_min": 9,
          "damage_max": 14,
          "save_dc": 13
        },
        "2": {
          "xp": 450,
          "prof_bonus": 2,
          "armor_class": 14,
          "hit_points_min": 32,
          "hit_points_max": 65,
          "attack_bonus": 3,
          "damage_min": 15,
          "damage_max": 20,
          "save_dc": 13
        },
        "3": {
          "xp": 700,
          "prof_bonus": 2,
          "armor_class": 14,
          "hit_points_min": 50,
          "hit_points_max": 80,
          "attack_bonus": 4,
          "damage_min": 21,
          "damage_max": 26,
          "save_dc": 13
        },
        "4": {
          "xp": 1100,
          "prof_bonus": 2,
          "armor_class": 15,
          "hit_points_min": 65,
          "hit_points_max": 100,
          "attack_bonus": 5,
          "damage_min": 27,
          "damage_max": 32,
          "save_dc": 14
        },
        "5": {
          "xp": 1800,
          "prof_bonus": 3,
          "armor_class": 15,
          "hit_points_min": 90,
          "hit_points_max": 120,
          "attack_bonus": 6,
          "damage_min": 33,
          "damage_max": 38,
          "save_dc": 15
        },
        "6": {
          "xp": 2300,
          "prof_bonus": 3,
          "armor_class": 15,
          "hit_points_min": 115,
          "hit_points_max": 140,
          "attack_bonus": 6,
          "damage_min": 39,
          "damage_max": 44,
          "save_dc": 15
        },
        "7": {
          "xp": 2900,
          "prof_bonus": 3,
          "armor_class": 16,
          "hit_points_min": 130,
          "hit_points_max": 165,
          "attack_bonus": 6,
          "damage_min": 45,
          "damage_max": 50,
          "save_dc": 15
        },
        "8": {
          "xp": 3900,
          "prof_bonus": 3,
          "armor_class": 16,
          "hit_points_min": 150,
          "hit_points_max": 190,
          "attack_bonus": 7,
          "damage_min": 51,
          "damage_max": 56,
          "save_dc": 16
        },
        "9": {
          "xp": 5000,
          "prof_bonus": 4,
          "armor_class": 16,
          "hit_points_min": 175,
          "hit_points_max": 205,
          "attack_bonus": 7,
          "damage_min": 57,
          "damage_max": 62,
          "save_dc": 16
        },
        "10": {
          "xp": 5900,
          "prof_bonus": 4,
          "armor_class": 17,
          "hit_points_min": 190,
          "hit_points_max": 230,
          "attack_bonus": 7,
          "damage_min": 63,
          "damage_max": 68,
          "save_dc": 16
        },
        "11": {
          "xp": 7200,
          "prof_bonus": 4,
          "armor_class": 17,
          "hit_points_min": 215,
          "hit_points_max": 255,
          "attack_bonus": 8,
          "damage_min": 69,
          "damage_max": 74,
          "save_dc": 17
        },
        "12": {
          "xp": 8400,
          "prof_bonus": 4,
          "armor_class": 17,
          "hit_points_min": 236,
          "hit_points_max": 250,
          "attack_bonus": 8,
          "damage_min": 75,
          "damage_max": 80,
          "save_dc": 18
        },
        "13": {
          "xp": 10000,
          "prof_bonus": 5,
          "armor_class": 18,
          "hit_points_min": 251,
          "hit_points_max": 265,
          "attack_bonus": 8,
          "damage_min": 81,
          "damage_max": 86,
          "save_dc": 18
        },
        "14": {
          "xp": 11500,
          "prof_bonus": 5,
          "armor_class": 18,
          "hit_points_min": 266,
          "hit_points_max": 280,
          "attack_bonus": 8,
          "damage_min": 87,
          "damage_max": 92,
          "save_dc": 18
        },
        "15": {
          "xp": 13000,
          "prof_bonus": 5,
          "armor_class": 18,
          "hit_points_min": 281,
          "hit_points_max": 295,
          "attack_bonus": 8,
          "damage_min": 93,
          "damage_max": 98,
          "save_dc": 18
        },
        "16": {
          "xp": 15000,
          "prof_bonus": 5,
          "armor_class": 19,
          "hit_points_min": 296,
          "hit_points_max": 310,
          "attack_bonus": 9,
          "damage_min": 99,
          "damage_max": 104,
          "save_dc": 18
        },
        "17": {
          "xp": 18000,
          "prof_bonus": 6,
          "armor_class": 19,
          "hit_points_min": 311,
          "hit_points_max": 325,
          "attack_bonus": 10,
          "damage_min": 105,
          "damage_max": 110,
          "save_dc": 19
        },
        "18": {
          "xp": 20000,
          "prof_bonus": 6,
          "armor_class": 19,
          "hit_points_min": 326,
          "hit_points_max": 340,
          "attack_bonus": 10,
          "damage_min": 111,
          "damage_max": 116,
          "save_dc": 19
        },
        "19": {
          "xp": 22000,
          "prof_bonus": 6,
          "armor_class": 20,
          "hit_points_min": 341,
          "hit_points_max": 355,
          "attack_bonus": 10,
          "damage_min": 117,
          "damage_max": 122,
          "save_dc": 19
        },
        "20": {
          "xp": 25000,
          "prof_bonus": 6,
          "armor_class": 20,
          "hit_points_min": 356,
          "hit_points_max": 400,
          "attack_bonus": 10,
          "damage_min": 123,
          "damage_max": 140,
          "save_dc": 19
        },
        "21": {
          "xp": 33000,
          "prof_bonus": 7,
          "armor_class": 20,
          "hit_points_min": 401,
          "hit_points_max": 445,
          "attack_bonus": 11,
          "damage_min": 141,
          "damage_max": 158,
          "save_dc": 20
        },
        "22": {
          "xp": 41000,
          "prof_bonus": 7,
          "armor_class": 20,
          "hit_points_min": 446,
          "hit_points_max": 490,
          "attack_bonus": 11,
          "damage_min": 159,
          "damage_max": 176,
          "save_dc": 20
        },
        "23": {
          "xp": 50000,
          "prof_bonus": 7,
          "armor_class": 20,
          "hit_points_min": 491,
          "hit_points_max": 535,
          "attack_bonus": 11,
          "damage_min": 177,
          "damage_max": 194,
          "save_dc": 20
        },
        "24": {
          "xp": 62000,
          "prof_bonus": 7,
          "armor_class": 21,
          "hit_points_min": 536,
          "hit_points_max": 580,
          "attack_bonus": 11,
          "damage_min": 195,
          "damage_max": 212,
          "save_dc": 21
        },
        "25": {
          "xp": 75000,
          "prof_bonus": 8,
          "armor_class": 21,
          "hit_points_min": 581,
          "hit_points_max": 625,
          "attack_bonus": 12,
          "damage_min": 213,
          "damage_max": 230,
          "save_dc": 21
        },
        "26": {
          "xp": 90000,
          "prof_bonus": 8,
          "armor_class": 21,
          "hit_points_min": 626,
          "hit_points_max": 670,
          "attack_bonus": 12,
          "damage_min": 231,
          "damage_max": 248,
          "save_dc": 21
        },
        "27": {
          "xp": 105000,
          "prof_bonus": 8,
          "armor_class": 21,
          "hit_points_min": 671,
          "hit_points_max": 715,
          "attack_bonus": 13,
          "damage_min": 249,
          "damage_max": 266,
          "save_dc": 22
        },
        "28": {
          "xp": 120000,
          "prof_bonus": 8,
          "armor_class": 22,
          "hit_points_min": 716,
          "hit_points_max": 760,
          "attack_bonus": 13,
          "damage_min": 267,
          "damage_max": 284,
          "save_dc": 22
        },
        "29": {
          "xp": 135000,
          "prof_bonus": 9,
          "armor_class": 22,
          "hit_points_min": 760,
          "hit_points_max": 805,
          "attack_bonus": 13,
          "damage_min": 285,
          "damage_max": 302,
          "save_dc": 22
        },
        "30": {
          "xp": 155000,
          "prof_bonus": 9,
          "armor_class": 22,
          "hit_points_min": 805,
          "hit_points_max": 850,
          "attack_bonus": 14,
          "damage_min": 303,
          "damage_max": 320,
          "save_dc": 23
        },
        "1/8": {
          "xp": 25,
          "prof_bonus": 2,
          "armor_class": 12,
          "hit_points_min": 5,
          "hit_points_max": 11,
          "attack_bonus": 3,
          "damage_min": 2,
          "damage_max": 3,
          "save_dc": 13
        },
        "1/4": {
          "xp": 50,
          "prof_bonus": 2,
          "armor_class": 13,
          "hit_points_min": 13,
          "hit_points_max": 24,
          "attack_bonus": 3,
          "damage_min": 4,
          "damage_max": 5,
          "save_dc": 13
        },
        "1/2": {
          "xp": 100,
          "prof_bonus": 2,
          "armor_class": 13,
          "hit_points_min": 16,
          "hit_points_max": 30,
          "attack_bonus": 3,
          "damage_min": 6,
          "damage_max": 8,
          "save_dc": 13
        }
      }
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

    def random_race
      player_races.sample
    end

    def random_alignment
      alignments.sample
    end

    # Challenge Rating Calculations
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

    def cr_for_npc(npc)
      raise TypeError, 'cr_for_npc expects a Character' unless npc.is_a?(Character)

      prof_cr = proficiency_cr(npc)
      def_cr = defensive_cr(npc)
      off_cr = offensive_cr(npc)
      # puts "#{npc.name} challenge rating calculation - proficiency CR: #{prof_cr} defense CR: #{def_cr} offense CR: #{off_cr}"
      cr_total = [prof_cr, def_cr, off_cr].inject(0, &:+)
      cr = (cr_total.to_f / 3.0)
      # puts "#{npc.name} CR value: #{cr}"
      case cr
      when 0...0.25
        '1/8'
      when 0.25...0.5
        '1/4'
      when 0.5...1.1
        '1/2'
      else
        cr.ceil.to_s
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

    def proficiency_cr(npc)
      case npc.proficiency
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

    def defensive_cr(npc)
      [hit_points_cr(npc.hit_points), armor_class_cr(npc.armor_class)].min
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

    def offensive_cr(npc)
      attack_bonuses = []
      damage_maximums = []
      npc_actions_count = 0
      npc.character_actions.each do |action|
        npc_actions_count += 1
        attack_bonuses << action.attack_bonus if action.attack_bonus
        next unless action.damage_dice

        damage_dice_str = action.damage_dice
        damage_dice_str.slice! '1h: '
        damage_dice_str.slice! '2h: '
        damage_numbers = damage_dice_str.scan(/\d/).map(&:to_i)
        max_damage = damage_numbers.reject(&:zero?).inject(:*)
        max_damage += action.damage_bonus if action.damage_bonus
        damage_maximums << max_damage
      end
      if damage_maximums.count.positive? && npc_actions_count.positive?
        damage_max_total = damage_maximums.inject(0, &:+)
        damage_per_round = (damage_max_total.to_f / npc_actions_count).ceil
        damage_cr = cr_for_damage(damage_per_round)
        attack_bonus_total = attack_bonuses.inject(0, &:+)
        attack_bonus_avg = (attack_bonus_total.to_f / npc_actions_count).ceil
        attack_bonus_cr = cr_for_attack_bonus(attack_bonus_avg)
      else
        damage_cr = cr_for_damage(0)
        attack_bonus_cr = cr_for_attack_bonus(0)
      end
      spell_save_dc = 0
      npc.character_classes.each do |character_class|
        spell_save_dc = character_class.spell_save_dc if character_class.spell_save_dc > spell_save_dc
      end
      spell_save_cr = cr_for_save_dc(spell_save_dc)

      offensive_cr_total = [damage_cr, attack_bonus_cr, spell_save_cr].inject(0, &:+)
      (offensive_cr_total.to_f / 2.0)
    end

    def cr_for_attack_bonus(attack_bonus)
      case attack_bonus
      when 0..2
        0.0
      when 3
        0.125
      when 4
        3.0
      when 5
        4.0
      when 6
        5.0
      when 7
        8.0
      when 8
        11.0
      when 9
        16.0
      when 10
        17.0
      when 11
        21.0
      when 12
        24.0
      when 13
        27.0
      else
        30.0
      end
    end

    def cr_for_damage(damage)
      case damage
      when 0..1
        0.0
      when 2..3
        0.125
      when 4..5
        0.25
      when 6..8
        0.5
      when 9..14
        1
      when 15..20
        2
      when 21..26
        3
      when 27..32
        4
      when 33..38
        5
      when 39..44
        6
      when 45..50
        7
      when 51..56
        8
      when 57..62
        9
      when 63..68
        10
      when 69..74
        11
      when 75..80
        12
      when 81..86
        13
      when 87..92
        14
      when 93..98
        15
      when 99..104
        16
      when 105..110
        17
      when 111..116
        18
      when 117..122
        19
      when 123..140
        20
      when 141..158
        21
      when 159..176
        22
      when 177..194
        23
      when 195..212
        24
      when 213..230
        25
      when 231..248
        26
      when 249..266
        27
      when 267..284
        28
      when 285..302
        29
      else
        30
      end
    end

    def cr_for_save_dc(save_dc)
      case save_dc
      when 0..12
        0
      when 13
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

    # Ability Score Calculations

    def ability_score_modifier(ability_score)
      {
        1 => -5, 2 => -4, 3 => -4, 4 => -3, 5 => -3, 6 => -2, 7 => -2,
        8 => -1, 9 => -1, 10 => 0, 11 => 0, 12 => 1, 13 => 1, 14 => 2, 15 => 2,
        16 => 3, 17 => 3, 18 => 4, 19 => 4, 20 => 5, 21 => 5, 22 => 6, 23 => 6,
        24 => 7, 25 => 7, 26 => 8, 27 => 8, 28 => 9, 29 => 9, 30 => 10, 31 => 10
      }[ability_score]
    end

    # Skills
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

    # Dice Rolls
    def roll_dice(num_dice, dice_value)
      result = 0
      (1..num_dice).each do
        result += rand(1..dice_value)
      end
      result
    end

    # Parse Dice String
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
            hit_die[:hit_dice_number] = values[0] || 1
            hit_die[:hit_dice_value] = values[1]
          elsif part == :sub
            hit_die[:hit_dice_modifier] = -str.to_i
          else
            hit_die[:hit_dice_modifier] = str.to_i
          end
        end
      end
      hit_die
    end
  end
end
