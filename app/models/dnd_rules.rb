# frozen_string_literal: true

class DndRules
  class << self
    def random_race
      [
        'dragonborn',
        'dwarf', 'mountain-dwarf', 'hill-dwarf',
        'elf', 'high-elf', 'wood-elf',
        'gnome', 'rock-gnome', 'forest-gnome',
        'half-orc',
        'halfling', 'stout-halfling', 'lightfoot-halfling',
        'human',
        'tiefling'
      ].sample
    end

    # Challenge Rating Calculations
    def xp_for_cr(challenge_rating)
      puts "Getting XP for CR: #{challenge_rating}"
      {
        "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700,
        "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900,
        "11": 7200, "12": 8400, "13": 10_000, "14": 11_500, "15": 13_000, "16": 15_000,
        "17": 18_000, "18": 20_000, "19": 22_000, "20": 25_000, "21": 33_000, "22": 41_000,
        "23": 50_000, "24": 62_000, "25": 75_000, "26": 90_000, "27": 105_000, "28": 120_000,
        "29": 135_000, "30": 155_000
      }[challenge_rating]
    end

    def cr_for_npc(npc)
      raise TypeError, 'cr_for_npc expects a Character' unless npc.is_a?(Character)
      def_cr = defensive_cr(npc)
      off_cr = offensive_cr(npc)
      cr_total = [def_cr, off_cr].inject(0, &:+)
      cr = (cr_total.to_f / 2.0).ceil
      cr.to_s
    end

    def defensive_cr(npc)
      ac_cr_points = [npc.armor_class - 13, 0].max
      ac_hp_points = (npc.hit_points / 30).ceil
      ac_cr_points + ac_hp_points
    end

    def offensive_cr(npc)
      if npc.character_actions.any?
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
        damage_per_round_cr = [(damage_per_round.to_f / 10.0).ceil, 30].min
        attack_bonus_total = attack_bonuses.inject(0, &:+)
        attack_bonus_avg = (attack_bonus_total.to_f / npc_actions_count).ceil
        attack_bonus_cr = [(attack_bonus_avg - 3) * 3, 30].min
        spell_save_dc_calc = [npc.spell_save_dc - 13, 0].max
        spell_save_dc_cr = [spell_save_dc_calc * 3, 30].min
        ((damage_per_round_cr + attack_bonus_cr + spell_save_dc_cr).to_f / 3.0).ceil
      else
        0
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
      when 'human'
        score + 1
      when 'mountain-dwarf'
        score + 2
      when 'dragonborn'
        score + 2
      when 'half-orc'
        score + 2
      else
        score
      end
    end

    def get_dexterity_for_race(score, race)
      case race.parameterize
      when 'human'
        score + 1
      when 'elf' || 'high-elf' || 'wood-elf'
        score + 2
      when 'forest-gnome'
        score + 1
      when 'halfling' || 'stout-halfling' || 'lightfoot-halfling'
        score + 2
      else
        score
      end
    end

    def get_constitution_for_race(score, race)
      case race.parameterize
      when 'human'
        score + 1
      when 'dwarf' || 'mountain-dwarf' || 'hill-dwarf'
        score + 2
      when 'stout-halfling'
        score + 1
      when 'half-orc'
        score + 1
      when 'rock-gnome'
        score + 1
      else
        score
      end
    end

    def get_intelligence_for_race(score, race)
      case race.parameterize
      when 'human'
        score + 1
      when 'high-elf'
        score + 1
      when 'gnome' || 'rock-gnome' || 'forest-gnome'
        score + 2
      when 'tiefling'
        score + 1
      else
        score
      end
    end

    def get_wisdom_for_race(score, race)
      case race.parameterize
      when 'human'
        score + 1
      when 'hill-dwarf'
        score + 1
      when 'wood-elf'
        score + 1
      else
        score
      end
    end

    def get_charisma_for_race(score, race)
      case race.parameterize
      when 'human'
        score + 1
      when 'drow'
        score + 1
      when 'half-elf'
        score + 2
      when 'dragonborn'
        score + 1
      when 'lightfoot-halfling'
        score + 1
      when 'tiefling'
        score + 2
      else
        score
      end
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
