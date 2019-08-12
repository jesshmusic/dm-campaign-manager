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

    def player_races
      [
        'Dragonborn',
        'Dwarf', 'Mountain Dwarf', 'Hill Dwarf',
        'Elf', 'High Elf', 'Wood Elf',
        'Gnome', 'Rock Gnome', 'Forest Gnome',
        'Half-orc',
        'Halfling', 'Stout Halfling', 'Lightfoot Halfling',
        'Human',
        'Tiefling'
      ]
    end

    def random_race
      player_races.sample
    end

    def random_alignment
      alignments.sample
    end

    # Challenge Rating Calculations
    def xp_for_cr(challenge_rating)
      xp = {
        '0' => 10, '1/8' => 25, '1/4' => 50, '1/2' => 100, '1' => 200, '2' => 450, '3' => 700,
        '4' => 1100, '5' => 1800, '6' => 2300, '7' => 2900, '8' => 3900, '9' => 5000, '10' => 5900,
        '11' => 7200, '12' => 8400, '13' => 10_000, '14' => 11_500, '15' => 13_000, '16' => 15_000,
        '17' => 18_000, '18' => 20_000, '19' => 22_000, '20' => 25_000, '21' => 33_000, '22' => 41_000,
        '23' => 50_000, '24' => 62_000, '25' => 75_000, '26' => 90_000, '27' => 105_000, '28' => 120_000,
        '29' => 135_000, '30' => 155_000
      }[challenge_rating.to_s]
      xp
    end

    def cr_for_npc(npc)
      raise TypeError, 'cr_for_npc expects a Character' unless npc.is_a?(Character)
      prof_cr = proficiency_cr(npc)
      def_cr = defensive_cr(npc)
      off_cr = offensive_cr(npc)
      puts "#{npc.name} challenge rating calculation - proficiency CR: #{prof_cr} defense CR: #{def_cr} offense CR: #{off_cr}"
      cr_total = [prof_cr, def_cr, off_cr].inject(0, &:+)
      cr = (cr_total.to_f / 3.0)
      puts "#{npc.name} CR value: #{cr}"
      cr_string = case cr
                  when 0...0.25
                    '1/8'
                  when 0.25...0.5
                    '1/4'
                  when 0.5...1.1
                    '1/2'
                  else
                    cr.floor.to_s
                  end
      cr_string
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
      # ac_cr = armor_class_cr(npc.armor_class)
      # hp_cr = hit_points_cr(npc.hit_points)
      [hit_points_cr(npc.hit_points), armor_class_cr(npc.armor_class)].min
      # def_cr_total = [ac_cr, hp_cr].inject(0, &:+)
      # (def_cr_total.to_f / 2.0)
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
      when 19
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
      damage_max_total = damage_maximums.inject(0, &:+)
      damage_per_round = (damage_max_total.to_f / npc_actions_count).ceil
      damage_cr = cr_for_damage(damage_per_round)
      attack_bonus_total = attack_bonuses.inject(0, &:+)
      attack_bonus_avg = (attack_bonus_total.to_f / npc_actions_count).ceil
      attack_bonus_cr = cr_for_attack_bonus(attack_bonus_avg)
      spell_save_dc = npc.spell_save_dc
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

    def get_strength_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'Mountain Dwarf'
        score + 2
      when 'Dragonborn'
        score + 2
      when 'Half-orc'
        score + 2
      else
        score
      end
    end

    def get_dexterity_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'Elf', 'High Elf', 'Wood Elf'
        score + 2
      when 'Forest Gnome'
        score + 1
      when 'Halfling', 'Stout Halfling', 'Lightfoot Halfling'
        score + 2
      else
        score
      end
    end

    def get_constitution_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'Dwarf', 'Mountain Dwarf', 'Hill Dwarf'
        score + 2
      when 'Stout Halfling'
        score + 1
      when 'Half-orc'
        score + 1
      when 'Rock Gnome'
        score + 1
      else
        score
      end
    end

    def get_intelligence_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'High Elf'
        score + 1
      when 'Gnome', 'Rock Gnome', 'Forest Gnome'
        score + 2
      when 'Tiefling'
        score + 1
      else
        score
      end
    end

    def get_wisdom_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'Hill Dwarf'
        score + 1
      when 'Wood Elf'
        score + 1
      else
        score
      end
    end

    def get_charisma_for_race(score, race)
      case race.parameterize
      when 'Human'
        score + 1
      when 'Drow'
        score + 1
      when 'Half-elf'
        score + 2
      when 'Dragonborn'
        score + 1
      when 'Lightfoot Halfling'
        score + 1
      when 'Tiefling'
        score + 2
      else
        score
      end
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

    # Probability Calculation
    # Pass array of hashes as such: `[{ item: Model, weight: Integer }]`
    def get_weighted_random_record(weighted_items)
      probabilities = probabilities(weighted_items)
      choice_weight = get_weight(probabilities)
      by_weight(weighted_items, choice_weight).sample[:item]
    end

    def sum_of_weights(weighted_items)
      weighted_items.sum { |weighted_item| weighted_item[:weight].to_f }
    end

    def probabilities(weighted_items)
      sum_of_weights = sum_of_weights(weighted_items)

      # initial probability
      probability = 0.0

      weights = weighted_items.map { |w| w[:weight] }.uniq.sort
      weights.map do |w|
        current_probability = (w / sum_of_weights).round(3)
        # sum the current_probability with the previous
        probability += current_probability
        { weight: w, probability: probability }
      end
    end

    def get_weight(probabilities)
      r = rand
      probabilities.each do |p|
        # puts "Weight: #{p[:weight]} - rand: #{r}, probability: #{p[:probability]}"
        return p[:weight] if r < p[:probability]
      end
      probabilities.first[:weight]
    end

    def by_weight(items, weight)
      # puts items
      # puts "Item weight: #{weight}"
      items.select { |el| el[:weight] == weight }
    end
  end
end
