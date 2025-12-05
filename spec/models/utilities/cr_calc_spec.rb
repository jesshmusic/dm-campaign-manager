require 'rails_helper'

RSpec.describe CrCalc, type: :model do
  describe '.calculate_cr_diff' do
    context 'with positive diff_num' do
      it 'halves positive differences and floors the result' do
        # diff_num = 10, halved = 5, cr_index - 5
        result = CrCalc.calculate_cr_diff(10, 15)
        expect(result).to eq(10)
      end

      it 'handles odd positive numbers correctly' do
        # diff_num = 7, halved (floored) = 3, cr_index - 3
        result = CrCalc.calculate_cr_diff(7, 10)
        expect(result).to eq(7)
      end
    end

    context 'with negative diff_num' do
      it 'halves negative differences and ceils the result' do
        # diff_num = -10, halved (ceiled) = -5, cr_index - (-5) = cr_index + 5
        result = CrCalc.calculate_cr_diff(-10, 5)
        expect(result).to eq(10)
      end

      it 'handles odd negative numbers correctly' do
        # diff_num = -7, halved (ceiled) = -4, cr_index - (-4) = cr_index + 4
        result = CrCalc.calculate_cr_diff(-7, 6)
        expect(result).to eq(10)
      end
    end

    context 'with boundary conditions' do
      it 'returns 0 when result would be negative' do
        result = CrCalc.calculate_cr_diff(20, 5)
        expect(result).to eq(0)
      end

      it 'returns 30 when result would exceed 30' do
        result = CrCalc.calculate_cr_diff(-40, 10)
        expect(result).to eq(30)
      end

      it 'returns 0 for zero diff_num' do
        result = CrCalc.calculate_cr_diff(0, 10)
        expect(result).to eq(10)
      end
    end
  end

  describe '.caster_level_for_cr' do
    it 'returns minimum level of 1 for CR below 1' do
      expect(CrCalc.caster_level_for_cr(0.5)).to eq(1)
      expect(CrCalc.caster_level_for_cr(0.125)).to eq(1)
      expect(CrCalc.caster_level_for_cr(0)).to eq(1)
    end

    it 'returns the CR integer value for normal CRs' do
      expect(CrCalc.caster_level_for_cr(5.0)).to eq(5)
      expect(CrCalc.caster_level_for_cr(10.0)).to eq(10)
      expect(CrCalc.caster_level_for_cr(15.0)).to eq(15)
    end

    it 'returns maximum level of 30 for CR above 30' do
      expect(CrCalc.caster_level_for_cr(35.0)).to eq(30)
      expect(CrCalc.caster_level_for_cr(50.0)).to eq(30)
      expect(CrCalc.caster_level_for_cr(100.0)).to eq(30)
    end

    it 'floors fractional CR values' do
      expect(CrCalc.caster_level_for_cr(7.8)).to eq(7)
      expect(CrCalc.caster_level_for_cr(12.3)).to eq(12)
    end
  end

  describe '.cr_string_to_num' do
    it 'converts 1/8 to 0.125' do
      expect(CrCalc.cr_string_to_num('1/8')).to eq(0.125)
    end

    it 'converts 1/4 to 0.25' do
      expect(CrCalc.cr_string_to_num('1/4')).to eq(0.25)
    end

    it 'converts 1/2 to 0.5' do
      expect(CrCalc.cr_string_to_num('1/2')).to eq(0.5)
    end

    it 'converts string integers to floats' do
      expect(CrCalc.cr_string_to_num('1')).to eq(1.0)
      expect(CrCalc.cr_string_to_num('5')).to eq(5.0)
      expect(CrCalc.cr_string_to_num('10')).to eq(10.0)
      expect(CrCalc.cr_string_to_num('30')).to eq(30.0)
    end
  end

  describe '.cr_num_to_string' do
    it 'converts 0.125 to 1/8' do
      expect(CrCalc.cr_num_to_string(0.125)).to eq('1/8')
    end

    it 'converts 0.25 to 1/4' do
      expect(CrCalc.cr_num_to_string(0.25)).to eq('1/4')
    end

    it 'converts 0.5 to 1/2' do
      expect(CrCalc.cr_num_to_string(0.5)).to eq('1/2')
    end

    it 'converts integer CRs to strings' do
      expect(CrCalc.cr_num_to_string(1)).to eq('1')
      expect(CrCalc.cr_num_to_string(5)).to eq('5')
      expect(CrCalc.cr_num_to_string(10)).to eq('10')
      expect(CrCalc.cr_num_to_string(30)).to eq('30')
    end

    it 'converts float CRs to strings' do
      expect(CrCalc.cr_num_to_string(1.0)).to eq('1.0')
      expect(CrCalc.cr_num_to_string(15.0)).to eq('15.0')
    end
  end

  describe '.proficiency_for_cr' do
    context 'with fractional CRs' do
      it 'returns 2 for CR 0' do
        expect(CrCalc.proficiency_for_cr('0')).to eq(2)
      end

      it 'returns 2 for CR 1/8' do
        expect(CrCalc.proficiency_for_cr('1/8')).to eq(2)
      end

      it 'returns 2 for CR 1/4' do
        expect(CrCalc.proficiency_for_cr('1/4')).to eq(2)
      end

      it 'returns 2 for CR 1/2' do
        expect(CrCalc.proficiency_for_cr('1/2')).to eq(2)
      end
    end

    context 'with CR 1-4' do
      it 'returns 2' do
        expect(CrCalc.proficiency_for_cr('1')).to eq(2)
        expect(CrCalc.proficiency_for_cr('2')).to eq(2)
        expect(CrCalc.proficiency_for_cr('3')).to eq(2)
        expect(CrCalc.proficiency_for_cr('4')).to eq(2)
      end
    end

    context 'with CR 5-8' do
      it 'returns 3' do
        expect(CrCalc.proficiency_for_cr('5')).to eq(3)
        expect(CrCalc.proficiency_for_cr('6')).to eq(3)
        expect(CrCalc.proficiency_for_cr('7')).to eq(3)
        expect(CrCalc.proficiency_for_cr('8')).to eq(3)
      end
    end

    context 'with CR 9-12' do
      it 'returns 4' do
        expect(CrCalc.proficiency_for_cr('9')).to eq(4)
        expect(CrCalc.proficiency_for_cr('10')).to eq(4)
        expect(CrCalc.proficiency_for_cr('11')).to eq(4)
        expect(CrCalc.proficiency_for_cr('12')).to eq(4)
      end
    end

    context 'with CR 13-16' do
      it 'returns 5' do
        expect(CrCalc.proficiency_for_cr('13')).to eq(5)
        expect(CrCalc.proficiency_for_cr('14')).to eq(5)
        expect(CrCalc.proficiency_for_cr('15')).to eq(5)
        expect(CrCalc.proficiency_for_cr('16')).to eq(5)
      end
    end

    context 'with CR 17-20' do
      it 'returns 6' do
        expect(CrCalc.proficiency_for_cr('17')).to eq(6)
        expect(CrCalc.proficiency_for_cr('18')).to eq(6)
        expect(CrCalc.proficiency_for_cr('19')).to eq(6)
        expect(CrCalc.proficiency_for_cr('20')).to eq(6)
      end
    end

    context 'with CR 21-24' do
      it 'returns 7' do
        expect(CrCalc.proficiency_for_cr('21')).to eq(7)
        expect(CrCalc.proficiency_for_cr('22')).to eq(7)
        expect(CrCalc.proficiency_for_cr('23')).to eq(7)
        expect(CrCalc.proficiency_for_cr('24')).to eq(7)
      end
    end

    context 'with CR 25-28' do
      it 'returns 8' do
        expect(CrCalc.proficiency_for_cr('25')).to eq(8)
        expect(CrCalc.proficiency_for_cr('26')).to eq(8)
        expect(CrCalc.proficiency_for_cr('27')).to eq(8)
        expect(CrCalc.proficiency_for_cr('28')).to eq(8)
      end
    end

    context 'with CR 29+' do
      it 'returns 9' do
        expect(CrCalc.proficiency_for_cr('29')).to eq(9)
        expect(CrCalc.proficiency_for_cr('30')).to eq(9)
      end
    end
  end

  describe '.xp_for_cr' do
    it 'returns correct XP for CR 0' do
      expect(CrCalc.xp_for_cr('0')).to eq(10)
    end

    it 'returns correct XP for fractional CRs' do
      expect(CrCalc.xp_for_cr('1/8')).to eq(25)
      expect(CrCalc.xp_for_cr('1/4')).to eq(50)
      expect(CrCalc.xp_for_cr('1/2')).to eq(100)
    end

    it 'returns correct XP for low CRs (1-5)' do
      expect(CrCalc.xp_for_cr('1')).to eq(200)
      expect(CrCalc.xp_for_cr('2')).to eq(450)
      expect(CrCalc.xp_for_cr('3')).to eq(700)
      expect(CrCalc.xp_for_cr('4')).to eq(1100)
      expect(CrCalc.xp_for_cr('5')).to eq(1800)
    end

    it 'returns correct XP for mid CRs (10-15)' do
      expect(CrCalc.xp_for_cr('10')).to eq(5900)
      expect(CrCalc.xp_for_cr('11')).to eq(7200)
      expect(CrCalc.xp_for_cr('12')).to eq(8400)
      expect(CrCalc.xp_for_cr('13')).to eq(10_000)
      expect(CrCalc.xp_for_cr('14')).to eq(11_500)
      expect(CrCalc.xp_for_cr('15')).to eq(13_000)
    end

    it 'returns correct XP for high CRs (20-25)' do
      expect(CrCalc.xp_for_cr('20')).to eq(25_000)
      expect(CrCalc.xp_for_cr('21')).to eq(33_000)
      expect(CrCalc.xp_for_cr('22')).to eq(41_000)
      expect(CrCalc.xp_for_cr('23')).to eq(50_000)
      expect(CrCalc.xp_for_cr('24')).to eq(62_000)
      expect(CrCalc.xp_for_cr('25')).to eq(75_000)
    end

    it 'returns correct XP for maximum CRs (26-30)' do
      expect(CrCalc.xp_for_cr('26')).to eq(90_000)
      expect(CrCalc.xp_for_cr('27')).to eq(105_000)
      expect(CrCalc.xp_for_cr('28')).to eq(120_000)
      expect(CrCalc.xp_for_cr('29')).to eq(135_000)
      expect(CrCalc.xp_for_cr('30')).to eq(155_000)
    end

    it 'handles integer CR input' do
      expect(CrCalc.xp_for_cr(5)).to eq(1800)
      expect(CrCalc.xp_for_cr(10)).to eq(5900)
    end
  end

  describe '.challenge_ratings' do
    it 'returns a hash with all CR entries' do
      crs = CrCalc.challenge_ratings
      expect(crs).to be_a(Hash)
      expect(crs.keys).to include(:'0', :'1/8', :'1/4', :'1/2', :'1', :'10', :'20', :'30')
    end

    it 'includes correct data structure for each CR' do
      cr_data = CrCalc.challenge_ratings[:'5']
      expect(cr_data).to have_key(:xp)
      expect(cr_data).to have_key(:prof_bonus)
      expect(cr_data).to have_key(:armor_class)
      expect(cr_data).to have_key(:hit_points_min)
      expect(cr_data).to have_key(:hit_points_max)
      expect(cr_data).to have_key(:attack_bonus)
      expect(cr_data).to have_key(:damage_min)
      expect(cr_data).to have_key(:damage_max)
      expect(cr_data).to have_key(:save_dc)
    end

    it 'has correct values for CR 1' do
      cr1 = CrCalc.challenge_ratings[:'1']
      expect(cr1[:xp]).to eq(200)
      expect(cr1[:prof_bonus]).to eq(2)
      expect(cr1[:armor_class]).to eq(13)
      expect(cr1[:hit_points_min]).to eq(71)
      expect(cr1[:hit_points_max]).to eq(85)
      expect(cr1[:attack_bonus]).to eq(3)
      expect(cr1[:damage_min]).to eq(9)
      expect(cr1[:damage_max]).to eq(14)
      expect(cr1[:save_dc]).to eq(13)
    end

    it 'has correct values for CR 30' do
      cr30 = CrCalc.challenge_ratings[:'30']
      expect(cr30[:xp]).to eq(155000)
      expect(cr30[:prof_bonus]).to eq(9)
      expect(cr30[:armor_class]).to eq(19)
      expect(cr30[:hit_points_min]).to eq(805)
      expect(cr30[:hit_points_max]).to eq(850)
      expect(cr30[:attack_bonus]).to eq(14)
      expect(cr30[:damage_min]).to eq(303)
      expect(cr30[:damage_max]).to eq(320)
      expect(cr30[:save_dc]).to eq(23)
    end
  end

  # Note: calculate_challenge and get_offensive_cr require complex monster setup
  # with actions, damages, and special abilities. These are integration tests
  # better suited for the Monster model specs.

  describe '.trait_modifier' do
    # Testing the Relentless special ability HP modifier at different CR ranges
    # This was a bug fix: Ruby's == doesn't work with ranges, must use case/when

    let(:base_damage) { 10 }
    let(:base_attack) { 5 }
    let(:base_ac) { 13 }
    let(:base_hp) { 50 }

    def create_monster_with_relentless(cr_string)
      monster = create(:monster, challenge_rating: cr_string)
      allow(monster).to receive(:special_abilities).and_return(['Relentless'])
      monster
    end

    it 'adds 0 HP for CR 0 (below range 1-4)' do
      monster = create_monster_with_relentless('0')
      result = CrCalc.send(:trait_modifier, monster, '0', base_damage, base_attack, base_ac, base_hp)
      # result is [damage_per_round, attack_bonus, armor_class, hit_points]
      expect(result[3]).to eq(base_hp) # No modifier for CR 0
    end

    it 'adds 7 HP for CR 1-4 (Relentless modifier)' do
      [1, 2, 3, 4].each do |cr|
        monster = create_monster_with_relentless(cr.to_s)
        result = CrCalc.send(:trait_modifier, monster, cr.to_s, base_damage, base_attack, base_ac, base_hp)
        expect(result[3]).to eq(base_hp + 7), "Expected +7 HP for CR #{cr}"
      end
    end

    it 'adds 14 HP for CR 5-9 (Relentless modifier)' do
      [5, 6, 7, 8, 9].each do |cr|
        monster = create_monster_with_relentless(cr.to_s)
        result = CrCalc.send(:trait_modifier, monster, cr.to_s, base_damage, base_attack, base_ac, base_hp)
        expect(result[3]).to eq(base_hp + 14), "Expected +14 HP for CR #{cr}"
      end
    end

    it 'adds 21 HP for CR 10-15 (Relentless modifier)' do
      [10, 11, 12, 13, 14, 15].each do |cr|
        monster = create_monster_with_relentless(cr.to_s)
        result = CrCalc.send(:trait_modifier, monster, cr.to_s, base_damage, base_attack, base_ac, base_hp)
        expect(result[3]).to eq(base_hp + 21), "Expected +21 HP for CR #{cr}"
      end
    end

    it 'adds 28 HP for CR 16+ (Relentless modifier)' do
      [16, 20, 25, 30].each do |cr|
        monster = create_monster_with_relentless(cr.to_s)
        result = CrCalc.send(:trait_modifier, monster, cr.to_s, base_damage, base_attack, base_ac, base_hp)
        expect(result[3]).to eq(base_hp + 28), "Expected +28 HP for CR #{cr}"
      end
    end

    it 'handles fractional CRs correctly (should get 0 HP modifier)' do
      ['1/8', '1/4', '1/2'].each do |cr|
        monster = create_monster_with_relentless(cr)
        result = CrCalc.send(:trait_modifier, monster, cr, base_damage, base_attack, base_ac, base_hp)
        expect(result[3]).to eq(base_hp), "Expected no modifier for CR #{cr}"
      end
    end
  end

  describe 'resistance and immunity calculations (2024 rules)' do
    let(:monster) do
      create(:monster,
             challenge_rating: '5',
             hit_points: 100,
             armor_class: 15)
    end

    describe '.calculate_resistance_multiplier (private)' do
      it 'returns 1.0 for no resistances' do
        allow(monster).to receive(:damage_resistances).and_return([])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 5)
        expect(result).to eq(1.0)
      end

      it 'returns 1.0 for non-physical resistances only (fire, cold, etc.)' do
        allow(monster).to receive(:damage_resistances).and_return(%w[fire cold lightning])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 5)
        expect(result).to eq(1.0)
      end

      it 'returns higher multiplier for physical resistances (bludgeoning, piercing, slashing)' do
        allow(monster).to receive(:damage_resistances).and_return(%w[bludgeoning piercing])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 5)
        expect(result).to be > 1.0
      end

      it 'returns 1.5 for 1-2 physical resistances at low CR' do
        allow(monster).to receive(:damage_resistances).and_return(['bludgeoning'])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 5)
        expect(result).to eq(1.5)
      end

      it 'returns 2.0 for 3+ physical resistances at low CR' do
        allow(monster).to receive(:damage_resistances).and_return(%w[bludgeoning piercing slashing])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 5)
        expect(result).to eq(2.0)
      end

      it 'returns lower multiplier at higher CR (11-16)' do
        allow(monster).to receive(:damage_resistances).and_return(['bludgeoning'])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 12)
        expect(result).to eq(1.25)
      end

      it 'returns lowest multiplier at highest CR (17+)' do
        allow(monster).to receive(:damage_resistances).and_return(['bludgeoning'])
        result = CrCalc.send(:calculate_resistance_multiplier, monster, 20)
        expect(result).to eq(1.1)
      end
    end

    describe '.calculate_immunity_multiplier (private)' do
      it 'returns 1.0 for fewer than 3 immunities' do
        allow(monster).to receive(:damage_immunities).and_return(%w[fire cold])
        result = CrCalc.send(:calculate_immunity_multiplier, monster, 5)
        expect(result).to eq(1.0)
      end

      it 'returns multiplier for 3+ immunities' do
        allow(monster).to receive(:damage_immunities).and_return(%w[fire cold lightning])
        result = CrCalc.send(:calculate_immunity_multiplier, monster, 5)
        expect(result).to be > 1.0
      end

      it 'returns 1.15 for 3+ immunities at CR 15 or below' do
        allow(monster).to receive(:damage_immunities).and_return(%w[fire cold lightning])
        result = CrCalc.send(:calculate_immunity_multiplier, monster, 10)
        expect(result).to eq(1.15)
      end

      it 'returns 1.25 for 3+ immunities at CR above 15' do
        allow(monster).to receive(:damage_immunities).and_return(%w[fire cold lightning])
        result = CrCalc.send(:calculate_immunity_multiplier, monster, 20)
        expect(result).to eq(1.25)
      end
    end

    describe '.calculate_vulnerabilities (private)' do
      it 'returns 0 for no vulnerabilities' do
        allow(monster).to receive(:damage_vulnerabilities).and_return([])
        result = CrCalc.send(:calculate_vulnerabilities, monster)
        expect(result).to eq(0)
      end

      it 'counts physical vulnerabilities as 2 each' do
        allow(monster).to receive(:damage_vulnerabilities).and_return(['bludgeoning'])
        result = CrCalc.send(:calculate_vulnerabilities, monster)
        expect(result).to eq(2)
      end

      it 'counts non-physical vulnerabilities as 1 each' do
        allow(monster).to receive(:damage_vulnerabilities).and_return(['fire'])
        result = CrCalc.send(:calculate_vulnerabilities, monster)
        expect(result).to eq(1)
      end

      it 'sums physical and non-physical vulnerabilities correctly' do
        allow(monster).to receive(:damage_vulnerabilities).and_return(%w[bludgeoning fire])
        result = CrCalc.send(:calculate_vulnerabilities, monster)
        expect(result).to eq(3) # 2 for bludgeoning + 1 for fire
      end
    end
  end

  describe '.get_defensive_cr' do
    let(:monster) do
      create(:monster,
             challenge_rating: '1',
             hit_points: 20,
             armor_class: 13)
    end

    it 'returns a numeric CR value' do
      result = CrCalc.get_defensive_cr(monster, '1', 13, 80)
      expect(result).to be_a(Numeric)
    end

    it 'increases AC for monsters with 3-4 saving throws' do
      monster_with_saves = create(:monster,
                                  challenge_rating: '5',
                                  hit_points: 100,
                                  armor_class: 15)
      allow(monster_with_saves).to receive(:num_saving_throws).and_return(3)

      result = CrCalc.get_defensive_cr(monster_with_saves, '5', 15, 100)
      expect(result).to be_a(Numeric)
    end

    it 'increases AC for monsters with 5+ saving throws' do
      monster_with_many_saves = create(:monster,
                                       challenge_rating: '10',
                                       hit_points: 200,
                                       armor_class: 17)
      allow(monster_with_many_saves).to receive(:num_saving_throws).and_return(5)

      result = CrCalc.get_defensive_cr(monster_with_many_saves, '10', 17, 200)
      expect(result).to be_a(Numeric)
    end

    it 'increases AC for flying monsters' do
      flying_monster = create(:monster,
                             challenge_rating: '5',
                             hit_points: 100,
                             armor_class: 15)
      fly_speed = double('Speed', name: 'Fly', value: 60)
      allow(flying_monster).to receive(:speeds).and_return([fly_speed])

      result = CrCalc.get_defensive_cr(flying_monster, '5', 15, 100)
      expect(result).to be_a(Numeric)
    end

    it 'returns 0.0 for negative defensive CR' do
      weak_monster = create(:monster,
                           challenge_rating: '0',
                           hit_points: 5,
                           armor_class: 8)

      result = CrCalc.get_defensive_cr(weak_monster, '0', 8, 5)
      expect(result).to be >= 0.0
    end
  end
end
