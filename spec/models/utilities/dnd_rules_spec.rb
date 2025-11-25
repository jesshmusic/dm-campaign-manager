require 'rails_helper'

RSpec.describe DndRules, type: :model do
  describe '.ability_score_modifier' do
    context 'low ability scores' do
      it 'returns -5 for ability score 1' do
        expect(DndRules.ability_score_modifier(1)).to eq(-5)
      end

      it 'returns -4 for ability scores 2-3' do
        expect(DndRules.ability_score_modifier(2)).to eq(-4)
        expect(DndRules.ability_score_modifier(3)).to eq(-4)
      end

      it 'returns -3 for ability scores 4-5' do
        expect(DndRules.ability_score_modifier(4)).to eq(-3)
        expect(DndRules.ability_score_modifier(5)).to eq(-3)
      end

      it 'returns -2 for ability scores 6-7' do
        expect(DndRules.ability_score_modifier(6)).to eq(-2)
        expect(DndRules.ability_score_modifier(7)).to eq(-2)
      end

      it 'returns -1 for ability scores 8-9' do
        expect(DndRules.ability_score_modifier(8)).to eq(-1)
        expect(DndRules.ability_score_modifier(9)).to eq(-1)
      end
    end

    context 'average ability scores' do
      it 'returns 0 for ability scores 10-11' do
        expect(DndRules.ability_score_modifier(10)).to eq(0)
        expect(DndRules.ability_score_modifier(11)).to eq(0)
      end

      it 'returns +1 for ability scores 12-13' do
        expect(DndRules.ability_score_modifier(12)).to eq(1)
        expect(DndRules.ability_score_modifier(13)).to eq(1)
      end

      it 'returns +2 for ability scores 14-15' do
        expect(DndRules.ability_score_modifier(14)).to eq(2)
        expect(DndRules.ability_score_modifier(15)).to eq(2)
      end
    end

    context 'high ability scores' do
      it 'returns +3 for ability scores 16-17' do
        expect(DndRules.ability_score_modifier(16)).to eq(3)
        expect(DndRules.ability_score_modifier(17)).to eq(3)
      end

      it 'returns +4 for ability scores 18-19' do
        expect(DndRules.ability_score_modifier(18)).to eq(4)
        expect(DndRules.ability_score_modifier(19)).to eq(4)
      end

      it 'returns +5 for ability scores 20-21' do
        expect(DndRules.ability_score_modifier(20)).to eq(5)
        expect(DndRules.ability_score_modifier(21)).to eq(5)
      end

      it 'returns +6 for ability scores 22-23' do
        expect(DndRules.ability_score_modifier(22)).to eq(6)
        expect(DndRules.ability_score_modifier(23)).to eq(6)
      end

      it 'returns +7 for ability scores 24-25' do
        expect(DndRules.ability_score_modifier(24)).to eq(7)
        expect(DndRules.ability_score_modifier(25)).to eq(7)
      end

      it 'returns +8 for ability scores 26-27' do
        expect(DndRules.ability_score_modifier(26)).to eq(8)
        expect(DndRules.ability_score_modifier(27)).to eq(8)
      end

      it 'returns +9 for ability scores 28-29' do
        expect(DndRules.ability_score_modifier(28)).to eq(9)
        expect(DndRules.ability_score_modifier(29)).to eq(9)
      end

      it 'returns +10 for ability scores 30-31' do
        expect(DndRules.ability_score_modifier(30)).to eq(10)
        expect(DndRules.ability_score_modifier(31)).to eq(10)
      end
    end
  end

  # Note: calculate_hp_and_hd is not tested because it references a non-existent
  # challenge_ratings method and is never used in the codebase (dead code)

  describe '.abilities' do
    it 'returns all six abilities' do
      abilities = DndRules.abilities

      expect(abilities).to eq(['Strength', 'Dexterity', 'Constitution',
                               'Intelligence', 'Wisdom', 'Charisma'])
    end

    it 'returns 6 abilities' do
      expect(DndRules.abilities.size).to eq(6)
    end
  end

  describe '.alignments' do
    it 'returns all 9 alignments' do
      expect(DndRules.alignments.size).to eq(9)
    end

    it 'includes all lawful alignments' do
      alignments = DndRules.alignments
      expect(alignments).to include('Lawful Good', 'Lawful Neutral', 'Lawful Evil')
    end

    it 'includes all neutral alignments' do
      alignments = DndRules.alignments
      expect(alignments).to include('Neutral Good', 'Neutral', 'Neutral Evil')
    end

    it 'includes all chaotic alignments' do
      alignments = DndRules.alignments
      expect(alignments).to include('Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil')
    end
  end

  describe '.alignments_non_evil' do
    it 'returns 6 non-evil alignments' do
      expect(DndRules.alignments_non_evil.size).to eq(6)
    end

    it 'excludes evil alignments' do
      alignments = DndRules.alignments_non_evil
      expect(alignments).not_to include('Lawful Evil', 'Neutral Evil', 'Chaotic Evil')
    end

    it 'includes good and neutral alignments' do
      alignments = DndRules.alignments_non_evil
      expect(alignments).to include('Lawful Good', 'Neutral Good', 'Chaotic Good')
      expect(alignments).to include('Lawful Neutral', 'Neutral', 'Chaotic Neutral')
    end
  end

  describe '.alignments_non_good' do
    it 'returns 6 non-good alignments' do
      expect(DndRules.alignments_non_good.size).to eq(6)
    end

    it 'excludes good alignments' do
      alignments = DndRules.alignments_non_good
      expect(alignments).not_to include('Lawful Good', 'Neutral Good', 'Chaotic Good')
    end

    it 'includes evil and neutral alignments' do
      alignments = DndRules.alignments_non_good
      expect(alignments).to include('Lawful Evil', 'Neutral Evil', 'Chaotic Evil')
      expect(alignments).to include('Lawful Neutral', 'Neutral', 'Chaotic Neutral')
    end
  end

  describe '.hit_die_for_size' do
    it 'returns d4 for tiny' do
      expect(DndRules.hit_die_for_size[:tiny]).to eq(4)
    end

    it 'returns d6 for small' do
      expect(DndRules.hit_die_for_size[:small]).to eq(6)
    end

    it 'returns d8 for medium' do
      expect(DndRules.hit_die_for_size[:medium]).to eq(8)
    end

    it 'returns d10 for large' do
      expect(DndRules.hit_die_for_size[:large]).to eq(10)
    end

    it 'returns d12 for huge' do
      expect(DndRules.hit_die_for_size[:huge]).to eq(12)
    end

    it 'returns d20 for gargantuan' do
      expect(DndRules.hit_die_for_size[:gargantuan]).to eq(20)
    end
  end

  describe '.hit_point_average_for_size' do
    it 'calculates correct averages for all sizes' do
      expect(DndRules.hit_point_average_for_size[:tiny]).to eq(2.5)
      expect(DndRules.hit_point_average_for_size[:small]).to eq(3.5)
      expect(DndRules.hit_point_average_for_size[:medium]).to eq(4.5)
      expect(DndRules.hit_point_average_for_size[:large]).to eq(5.5)
      expect(DndRules.hit_point_average_for_size[:huge]).to eq(6.5)
      expect(DndRules.hit_point_average_for_size[:gargantuan]).to eq(10.5)
    end

    it 'has averages matching half hit die + 0.5' do
      expect(DndRules.hit_point_average_for_size[:tiny]).to eq(4 / 2.0 + 0.5)
      expect(DndRules.hit_point_average_for_size[:medium]).to eq(8 / 2.0 + 0.5)
      expect(DndRules.hit_point_average_for_size[:gargantuan]).to eq(20 / 2.0 + 0.5)
    end
  end

  describe '.npc_spell_slots' do
    it 'returns spell slots for level 1 caster' do
      slots = DndRules.npc_spell_slots(1)
      expect(slots).to eq([2, 0, 0, 0, 0, 0, 0, 0, 0])
    end

    it 'returns spell slots for level 5 caster' do
      slots = DndRules.npc_spell_slots(5)
      expect(slots).to eq([4, 3, 2, 0, 0, 0, 0, 0, 0])
    end

    it 'returns spell slots for level 10 caster' do
      slots = DndRules.npc_spell_slots(10)
      expect(slots).to eq([4, 3, 3, 3, 2, 0, 0, 0, 0])
    end

    it 'returns spell slots for level 20 caster' do
      slots = DndRules.npc_spell_slots(20)
      expect(slots).to eq([4, 3, 3, 3, 3, 2, 2, 1, 1])
    end

    it 'returns array of 9 spell slot levels' do
      (1..20).each do |level|
        slots = DndRules.npc_spell_slots(level)
        expect(slots.size).to eq(9)
      end
    end

    it 'has at least 2 cantrips for all levels' do
      (1..20).each do |level|
        slots = DndRules.npc_spell_slots(level)
        expect(slots[0]).to be >= 2
      end
    end

    it 'has correct cantrip progression' do
      expect(DndRules.npc_spell_slots(1)[0]).to eq(2)
      expect(DndRules.npc_spell_slots(2)[0]).to eq(3)
      expect(DndRules.npc_spell_slots(3)[0]).to eq(4)
      expect(DndRules.npc_spell_slots(10)[0]).to eq(4)
      expect(DndRules.npc_spell_slots(20)[0]).to eq(4)
    end
  end

  describe '.parse_dice_string' do
    it 'parses simple dice notation' do
      result = DndRules.parse_dice_string('2d6')
      expect(result[:hit_dice_number]).to eq(2)
      expect(result[:hit_dice_value]).to eq(6)
    end

    it 'parses single die' do
      result = DndRules.parse_dice_string('1d8')
      expect(result[:hit_dice_number]).to eq(1)
      expect(result[:hit_dice_value]).to eq(8)
    end

    it 'parses large numbers of dice' do
      result = DndRules.parse_dice_string('10d10')
      expect(result[:hit_dice_number]).to eq(10)
      expect(result[:hit_dice_value]).to eq(10)
    end

    it 'handles d20' do
      result = DndRules.parse_dice_string('3d20')
      expect(result[:hit_dice_number]).to eq(3)
      expect(result[:hit_dice_value]).to eq(20)
    end
  end

  describe '.player_races' do
    it 'returns an array of player races' do
      expect(DndRules.player_races).to be_an(Array)
    end

    it 'includes all core races' do
      races = DndRules.player_races
      expect(races).to include('Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Tiefling')
    end

    it 'includes subraces' do
      races = DndRules.player_races
      expect(races).to include('High Elf', 'Wood Elf', 'Hill Dwarf', 'Mountain Dwarf')
    end
  end

  describe '.proficiency_bonus_for_level' do
    it 'returns +2 for levels 1-4' do
      expect(DndRules.proficiency_bonus_for_level(1)).to eq(2)
      expect(DndRules.proficiency_bonus_for_level(4)).to eq(2)
    end

    it 'returns +3 for levels 5-8' do
      expect(DndRules.proficiency_bonus_for_level(5)).to eq(3)
      expect(DndRules.proficiency_bonus_for_level(8)).to eq(3)
    end

    it 'returns +4 for levels 9-12' do
      expect(DndRules.proficiency_bonus_for_level(9)).to eq(4)
      expect(DndRules.proficiency_bonus_for_level(12)).to eq(4)
    end

    it 'returns +5 for levels 13-16' do
      expect(DndRules.proficiency_bonus_for_level(13)).to eq(5)
      expect(DndRules.proficiency_bonus_for_level(16)).to eq(5)
    end

    it 'returns +6 for levels 17+' do
      expect(DndRules.proficiency_bonus_for_level(17)).to eq(6)
      expect(DndRules.proficiency_bonus_for_level(20)).to eq(6)
    end
  end

  describe '.proficiency_for_hit_points' do
    it 'returns +2 for HP 1-130' do
      expect(DndRules.proficiency_for_hit_points(1)).to eq(2)
      expect(DndRules.proficiency_for_hit_points(130)).to eq(2)
    end

    it 'returns +3 for HP 131-190' do
      expect(DndRules.proficiency_for_hit_points(131)).to eq(3)
      expect(DndRules.proficiency_for_hit_points(190)).to eq(3)
    end

    it 'returns +4 for HP 191-250' do
      expect(DndRules.proficiency_for_hit_points(191)).to eq(4)
      expect(DndRules.proficiency_for_hit_points(250)).to eq(4)
    end

    it 'returns +5 for HP 251-310' do
      expect(DndRules.proficiency_for_hit_points(251)).to eq(5)
      expect(DndRules.proficiency_for_hit_points(310)).to eq(5)
    end

    it 'returns +6 for HP 311-400' do
      expect(DndRules.proficiency_for_hit_points(311)).to eq(6)
      expect(DndRules.proficiency_for_hit_points(400)).to eq(6)
    end

    it 'returns +7 for HP 401-580' do
      expect(DndRules.proficiency_for_hit_points(401)).to eq(7)
      expect(DndRules.proficiency_for_hit_points(580)).to eq(7)
    end

    it 'returns +8 for HP 581-760' do
      expect(DndRules.proficiency_for_hit_points(581)).to eq(8)
      expect(DndRules.proficiency_for_hit_points(760)).to eq(8)
    end

    it 'returns +9 for HP 761+' do
      expect(DndRules.proficiency_for_hit_points(761)).to eq(9)
      expect(DndRules.proficiency_for_hit_points(1000)).to eq(9)
    end
  end

  describe '.race_values' do
    it 'returns a hash of race keys to display names' do
      expect(DndRules.race_values).to be_a(Hash)
    end

    it 'includes all player races' do
      races = DndRules.race_values
      expect(races[:human]).to eq('Human')
      expect(races[:elf]).to eq('Elf')
      expect(races[:dwarf]).to eq('Dwarf')
    end

    it 'includes subraces with proper formatting' do
      races = DndRules.race_values
      expect(races[:elf_high]).to eq('Elf (high)')
      expect(races[:dwarf_hill]).to eq('Dwarf (hill)')
    end
  end

  describe '.random_alignment' do
    it 'returns one of the nine alignments' do
      alignment = DndRules.random_alignment
      expect(DndRules.alignments).to include(alignment)
    end
  end

  describe '.random_race' do
    it 'returns one of the player races' do
      race = DndRules.random_race
      expect(DndRules.player_races).to include(race)
    end
  end

  describe '.roll_dice' do
    it 'returns a numeric result' do
      result = DndRules.roll_dice(2, 6)
      expect(result).to be_a(Numeric)
    end

    it 'returns value between num_dice and num_dice*dice_value' do
      result = DndRules.roll_dice(3, 6)
      expect(result).to be_between(3, 18)
    end

    it 'adds modifier to result' do
      # Run multiple times to ensure modifier is always added
      10.times do
        result = DndRules.roll_dice(1, 6, 5)
        expect(result).to be_between(6, 11)
      end
    end
  end

  describe '.senses' do
    it 'returns a hash of sense types' do
      expect(DndRules.senses).to be_a(Hash)
    end

    it 'includes standard D&D senses' do
      senses = DndRules.senses
      expect(senses).to have_key(:darkvision)
      expect(senses).to have_key(:blindsight)
      expect(senses).to have_key(:tremorsense)
      expect(senses).to have_key(:truesight)
    end
  end

  describe '.skills' do
    it 'returns an array of skill names' do
      expect(DndRules.skills).to be_an(Array)
    end

    it 'includes all 18 D&D skills' do
      skills = DndRules.skills
      expect(skills).to include('Skill: Acrobatics', 'Skill: Athletics', 'Skill: Stealth')
      expect(skills).to include('Skill: Arcana', 'Skill: History', 'Skill: Investigation')
      expect(skills).to include('Skill: Perception', 'Skill: Insight', 'Skill: Survival')
    end
  end

  describe '.skill_abilities' do
    it 'returns a hash mapping skills to abilities' do
      expect(DndRules.skill_abilities).to be_a(Hash)
    end

    it 'maps physical skills to correct abilities' do
      abilities = DndRules.skill_abilities
      expect(abilities['Skill: Athletics']).to eq('strength')
      expect(abilities['Skill: Acrobatics']).to eq('dexterity')
      expect(abilities['Skill: Stealth']).to eq('dexterity')
    end

    it 'maps mental skills to correct abilities' do
      abilities = DndRules.skill_abilities
      expect(abilities['Skill: Arcana']).to eq('intelligence')
      expect(abilities['Skill: Perception']).to eq('wisdom')
      expect(abilities['Skill: Persuasion']).to eq('charisma')
    end
  end
end
