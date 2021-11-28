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
        20 => [4, 3, 3, 3, 3, 2, 2, 1, 1],
        21 => [4, 3, 3, 3, 3, 2, 2, 1, 1],
        22 => [4, 3, 3, 3, 3, 2, 2, 1, 1],
        23 => [4, 3, 3, 3, 3, 2, 2, 1, 1],
        24 => [4, 4, 3, 3, 3, 2, 2, 1, 1],
        25 => [4, 4, 3, 3, 3, 2, 2, 1, 1],
        26 => [4, 4, 4, 3, 3, 2, 2, 1, 1],
        27 => [4, 4, 4, 3, 3, 2, 2, 1, 1],
        28 => [4, 4, 4, 3, 3, 2, 2, 1, 1],
        29 => [4, 4, 4, 3, 3, 2, 2, 1, 1],
        30 => [4, 4, 4, 4, 3, 2, 2, 1, 1]
      }[caster_level]
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
  end
end
