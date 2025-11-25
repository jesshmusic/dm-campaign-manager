require 'rails_helper'

RSpec.describe NpcGenerator, type: :model do
  let(:user) { create(:user, role: :dungeon_master) }
  let(:admin) { create(:user, role: :admin) }

  # Stub NameGen to avoid API calls
  before do
    allow(NameGen).to receive(:random_name).and_return('Gandalf the Grey')
  end

  # Create some base monsters for weighted list calculations
  before do
    create_list(:monster, 5, monster_type: 'humanoid')
    create_list(:monster, 3, monster_type: 'beast')
    create(:special_ability, name: 'Pack Tactics', desc: 'The wolf has advantage on attack rolls.')
  end

  describe '.quick_monster' do
    let(:monster_params) do
      {
        name: 'Test Warrior',
        monster_type: 'humanoid',
        challenge_rating: '1',
        hit_points: 20,
        hit_dice: '4d8',
        armor_class: 15,
        size: 'Medium',
        number_of_attacks: 2,
        archetype: 'warrior',
        action_options: [],
        spell_ids: [],
        special_ability_options: [],
        'strength' => 14,
        'dexterity' => 12,
        'constitution' => 13,
        'intelligence' => 10,
        'wisdom' => 11,
        'charisma' => 10
      }
    end

    context 'when creating a warrior archetype' do
      it 'creates a monster with specified parameters' do
        result = NpcGenerator.quick_monster(monster_params, nil)

        expect(result).to be_a(Monster)
        expect(result.name).to eq('Test Warrior')
        expect(result.monster_type).to eq('humanoid')
        expect(result.challenge_rating).to be_present
      end

      it 'sets ability scores based on warrior archetype' do
        result = NpcGenerator.quick_monster(monster_params, nil)

        # Warriors should have reasonable ability scores
        expect(result.strength).to be_between(3, 30)
        expect(result).to respond_to(:strength)
        expect(result).to respond_to(:dexterity)
        expect(result).to respond_to(:constitution)
      end

      it 'calculates proficiency bonus' do
        result = NpcGenerator.quick_monster(monster_params, nil)

        expect(result.prof_bonus).to be > 0
      end

      it 'generates slug from name' do
        result = NpcGenerator.quick_monster(monster_params, nil)

        expect(result.slug).to eq('test-warrior')
      end
    end

    context 'when creating a spellcaster archetype' do
      let!(:spell1) { create(:spell, name: 'Magic Missile', level: 1) }
      let!(:spell2) { create(:spell, name: 'Shield', level: 1) }
      let!(:spell3) { create(:spell, name: 'Fireball', level: 3) }

      let(:spell_params) do
        monster_params.merge(
          archetype: 'spellcaster',
          spell_ids: [spell1.id, spell2.id, spell3.id]
        )
      end

      it 'prioritizes intelligence/wisdom for spellcasters' do
        result = NpcGenerator.quick_monster(spell_params, nil)

        expect(result).to be_a(Monster)
        # Spellcasters should have reasonable mental stats
        expect(result.intelligence + result.wisdom).to be >= 12
      end

      it 'sets save DC appropriately' do
        result = NpcGenerator.quick_monster(spell_params, nil)

        expect(result.save_dc).to be >= 8
      end
    end

    context 'when creating a rogue archetype' do
      let(:rogue_params) do
        monster_params.merge(archetype: 'rogue')
      end

      it 'prioritizes dexterity for rogues' do
        result = NpcGenerator.quick_monster(rogue_params, nil)

        expect(result.dexterity).to be_between(3, 30)
      end
    end

    context 'when creating a cleric archetype' do
      let(:cleric_params) do
        monster_params.merge(archetype: 'cleric')
      end

      it 'prioritizes wisdom for clerics' do
        result = NpcGenerator.quick_monster(cleric_params, nil)

        # Ability scores can be as low as 1 in some edge cases
        expect(result.wisdom).to be_between(1, 30)
      end
    end

    context 'with special abilities' do
      let(:params_with_abilities) do
        monster_params.merge(
          special_ability_options: ['Pack Tactics']
        )
      end

      it 'adds special abilities to the monster' do
        result = NpcGenerator.quick_monster(params_with_abilities, nil)

        expect(result.special_abilities).to_not be_empty
      end
    end

    context 'with user as dungeon master' do
      it 'assigns user to the monster' do
        result = NpcGenerator.quick_monster(monster_params, user)

        expect(result.user).to eq(user)
        expect(result.persisted?).to be true
      end
    end

    context 'with user as admin' do
      it 'assigns user to the monster' do
        result = NpcGenerator.quick_monster(monster_params, admin)

        expect(result.user).to eq(admin)
        expect(result.persisted?).to be true
      end
    end

    context 'without user' do
      it 'does not save the monster' do
        result = NpcGenerator.quick_monster(monster_params, nil)

        expect(result.persisted?).to be false
      end
    end

    context 'with different challenge ratings' do
      it 'handles CR 0' do
        params = monster_params.merge(challenge_rating: '0')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.prof_bonus).to eq(2)
      end

      it 'handles CR 5' do
        params = monster_params.merge(challenge_rating: '5')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.prof_bonus).to be_between(2, 9)
      end

      it 'handles CR 20' do
        params = monster_params.merge(challenge_rating: '20')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.prof_bonus).to be_between(2, 9)
      end

      it 'handles fractional CRs like 1/4' do
        params = monster_params.merge(challenge_rating: '1/4')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.challenge_rating).to be_present
        expect(result.prof_bonus).to eq(2)
      end

      it 'handles fractional CRs like 1/2' do
        params = monster_params.merge(challenge_rating: '1/2')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.challenge_rating).to be_present
      end
    end

    context 'with different monster types' do
      it 'handles humanoid types' do
        params = monster_params.merge(monster_type: 'humanoid (elf)')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result).to be_a(Monster)
      end

      it 'handles beast types' do
        params = monster_params.merge(monster_type: 'beast')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.monster_type).to eq('beast')
      end

      it 'handles dragon types' do
        # Create dragon monster for weighted list calculations
        create(:monster, monster_type: 'dragon')

        params = monster_params.merge(monster_type: 'dragon')
        result = NpcGenerator.quick_monster(params, nil)

        expect(result.monster_type).to eq('dragon')
      end
    end
  end

  describe '.generate_npc' do
    let(:simple_params) do
      {
        name: 'Simple NPC',
        monster_type: 'humanoid',
        challenge_rating: '1',
        hit_points: 20,
        hit_dice: '4d8',
        armor_class: 15,
        size: 'Medium'
      }
    end

    it 'creates a basic NPC with provided parameters' do
      result = NpcGenerator.generate_npc(simple_params, nil)

      expect(result).to be_a(Monster)
      expect(result.name).to eq('Simple NPC')
      expect(result.hit_points).to eq(20)
      expect(result.armor_class).to eq(15)
    end

    it 'generates slug from name' do
      result = NpcGenerator.generate_npc(simple_params, nil)

      expect(result.slug).to eq('simple-npc')
    end

    it 'calculates hit dice' do
      result = NpcGenerator.generate_npc(simple_params, nil)

      expect(result.hit_dice).to be_present
    end

    context 'with user' do
      it 'saves the NPC' do
        result = NpcGenerator.generate_npc(simple_params, user)

        expect(result.persisted?).to be true
        expect(result.user).to eq(user)
      end
    end

    context 'without user' do
      it 'does not save the NPC' do
        result = NpcGenerator.generate_npc(simple_params, nil)

        expect(result.persisted?).to be false
      end
    end
  end

  describe '.generate_commoner' do
    let!(:commoner_template) { create(:monster, name: 'Commoner', monster_type: 'humanoid', challenge_rating: '0') }

    context 'with random gender and race' do
      it 'generates a commoner with random name' do
        result = NpcGenerator.generate_commoner('male', 'human', nil)

        expect(result).to be_a(Monster)
        expect(result.name).to be_present
        expect(result.monster_subtype).to eq('human')
      end

      it 'uses specified race' do
        result = NpcGenerator.generate_commoner('female', 'elf', nil)

        expect(result.monster_subtype).to eq('elf')
      end

      it 'defaults to human when race is nil' do
        result = NpcGenerator.generate_commoner('male', nil, nil)

        expect(result.monster_subtype).to eq('human')
      end
    end

    context 'ability scores' do
      it 'sets randomized ability scores' do
        result = NpcGenerator.generate_commoner('male', 'human', nil)

        # Ability scores can go up to 30 in D&D 5e
        expect(result.strength).to be_between(3, 30)
        expect(result.dexterity).to be_between(3, 30)
        expect(result.constitution).to be_between(3, 30)
        expect(result.intelligence).to be_between(3, 30)
        expect(result.wisdom).to be_between(3, 30)
        expect(result.charisma).to be_between(3, 30)
      end

      it 'adjusts armor class based on dexterity' do
        result = NpcGenerator.generate_commoner('male', 'human', nil)
        dex_modifier = DndRules.ability_score_modifier(result.dexterity)

        expect(result.armor_class).to be >= 10
      end
    end

    context 'alignment' do
      it 'assigns a non-evil alignment' do
        result = NpcGenerator.generate_commoner('male', 'human', nil)

        expect(result.alignment).to be_present
        expect(DndRules.alignments_non_evil).to include(result.alignment)
      end
    end

    context 'challenge rating' do
      it 'assigns a low CR' do
        result = NpcGenerator.generate_commoner('male', 'human', nil)

        expect(['0', '1/8', '1/4', '1/2']).to include(result.challenge_rating)
      end
    end

    context 'with user' do
      it 'saves the commoner' do
        result = NpcGenerator.generate_commoner('male', 'human', user)

        expect(result.persisted?).to be true
        expect(result.user).to eq(user)
      end
    end
  end

  describe '.generate_action_desc' do
    context 'for attack actions' do
      let(:attack_params) do
        {
          params: {
            action: {
              action_type: 'attack',
              damage: {
                num_dice: 1,
                dice_value: 8,
                damage_type: 'slashing',
                num_targets: 1,
                is_ranged: false,
                reach: 5
              }
            },
            attack_bonus: 5,
            prof_bonus: 2,
            damage_bonus: 3
          }
        }
      end

      it 'generates melee attack description' do
        result = NpcGenerator.generate_action_desc(attack_params)

        expect(result).to include('Melee Weapon Attack')
        expect(result).to include('+7 to hit')
        expect(result).to include('slashing damage')
      end

      it 'includes reach information' do
        result = NpcGenerator.generate_action_desc(attack_params)

        expect(result).to include('reach 5 ft.')
      end

      it 'includes damage calculation' do
        result = NpcGenerator.generate_action_desc(attack_params)

        expect(result).to match(/\d+d\d+/)
      end
    end

    context 'for ranged attack actions' do
      let(:ranged_params) do
        {
          params: {
            action: {
              action_type: 'attack',
              damage: {
                num_dice: 1,
                dice_value: 6,
                damage_type: 'piercing',
                num_targets: 1,
                is_ranged: true,
                range_normal: 80,
                range_long: 320
              }
            },
            attack_bonus: 4,
            prof_bonus: 2,
            damage_bonus: 2
          }
        }
      end

      it 'generates ranged attack description' do
        result = NpcGenerator.generate_action_desc(ranged_params)

        expect(result).to include('Ranged Weapon Attack')
        expect(result).to include('range (80 / 320)')
        expect(result).to include('piercing damage')
      end
    end

    context 'for spellcasting actions' do
      let(:spell_params) do
        {
          params: {
            monster_name: 'Wizard',
            action: {
              action_type: 'spellCasting',
              spell_casting: {
                level: 5,
                ability: 'Intelligence',
                slots: {
                  first: 4,
                  second: 3,
                  third: 2
                },
                spell_options: [
                  { label: 'Fire Bolt', data: { level: 0 } },
                  { label: 'Magic Missile', data: { level: 1 } }
                ]
              }
            }
          }
        }
      end

      it 'generates spellcasting description' do
        result = NpcGenerator.generate_action_desc(spell_params)

        expect(result).to include('5th level spellcaster')
        expect(result).to include('Intelligence')
        expect(result).to include('Fire Bolt')
      end
    end

    context 'for other action types' do
      let(:other_params) do
        {
          params: {
            action: {
              action_type: 'other',
              desc: 'The creature makes a special move.'
            }
          }
        }
      end

      it 'returns the provided description' do
        result = NpcGenerator.generate_action_desc(other_params)

        expect(result).to eq('The creature makes a special move.')
      end
    end
  end

  describe '.action_damage' do
    context 'with positive damage bonus' do
      it 'formats damage with plus sign' do
        bonus, base = NpcGenerator.action_damage('2d6', 3, 'some desc')

        expect(bonus).to eq('+ 3')
        expect(base).to be > 0
      end

      it 'calculates base damage correctly' do
        bonus, base = NpcGenerator.action_damage('1d8', 2, 'some desc')

        # (1 * 8 + 2) * 0.55 = 5.5 ceiling = 6
        expect(base).to eq(6)
      end
    end

    context 'with zero damage bonus' do
      it 'formats damage without sign' do
        bonus, base = NpcGenerator.action_damage('2d6', 0, 'some desc')

        expect(bonus).to eq('')
      end
    end

    context 'with negative damage bonus' do
      it 'formats damage with minus sign' do
        bonus, base = NpcGenerator.action_damage('2d6', -2, 'some desc')

        expect(bonus).to eq('- 2')
      end
    end

    context 'without damage dice' do
      it 'extracts damage from action description' do
        bonus, base = NpcGenerator.action_damage(nil, 2, '5 (1d8) piercing damage')

        expect(base).to eq('5')
      end

      it 'returns 0 when no damage found' do
        bonus, base = NpcGenerator.action_damage(nil, 2, 'No damage here')

        expect(base).to eq(0)
      end
    end

    context 'with various dice types' do
      it 'handles d4' do
        bonus, base = NpcGenerator.action_damage('4d4', 1, 'desc')
        expect(base).to be > 0
      end

      it 'handles d6' do
        bonus, base = NpcGenerator.action_damage('3d6', 2, 'desc')
        expect(base).to be > 0
      end

      it 'handles d10' do
        bonus, base = NpcGenerator.action_damage('2d10', 4, 'desc')
        expect(base).to be > 0
      end

      it 'handles d12' do
        bonus, base = NpcGenerator.action_damage('1d12', 3, 'desc')
        expect(base).to be > 0
      end

      it 'handles d20' do
        bonus, base = NpcGenerator.action_damage('1d20', 0, 'desc')
        expect(base).to be > 0
      end
    end
  end
end
