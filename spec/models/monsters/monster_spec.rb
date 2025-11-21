require 'rails_helper'

RSpec.describe Monster, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:monster)).to be_valid
    end
  end

  describe 'associations' do
    it 'has_many actions' do
      monster = create(:monster)
      expect(monster).to respond_to(:actions)
    end

    it 'has_many monster_actions' do
      monster = create(:monster)
      expect(monster).to respond_to(:monster_actions)
    end

    it 'has_many legendary_actions' do
      monster = create(:monster)
      expect(monster).to respond_to(:legendary_actions)
    end

    it 'has_many reactions' do
      monster = create(:monster)
      expect(monster).to respond_to(:reactions)
    end

    it 'has_many special_abilities' do
      monster = create(:monster)
      expect(monster).to respond_to(:special_abilities)
    end

    it 'has_many senses' do
      monster = create(:monster)
      expect(monster).to respond_to(:senses)
    end

    it 'has_many speeds' do
      monster = create(:monster)
      expect(monster).to respond_to(:speeds)
    end

    it 'has_many monster_proficiencies' do
      monster = create(:monster)
      expect(monster).to respond_to(:monster_proficiencies)
    end

    it 'belongs_to user (optional)' do
      monster = create(:monster)
      expect(monster).to respond_to(:user)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      monster = create(:monster, name: 'Dragon')
      expect(monster.name).to eq('Dragon')
    end

    it 'has size attribute' do
      monster = create(:monster, size: 'Large')
      expect(monster.size).to eq('Large')
    end

    it 'has monster_type attribute' do
      monster = create(:monster, monster_type: 'Beast')
      expect(monster.monster_type).to eq('Beast')
    end

    it 'has alignment attribute' do
      monster = create(:monster, alignment: 'Neutral')
      expect(monster.alignment).to eq('Neutral')
    end

    it 'has armor_class attribute' do
      monster = create(:monster, armor_class: 15)
      expect(monster.armor_class).to eq(15)
    end

    it 'has hit_points attribute' do
      monster = create(:monster, hit_points: 100)
      expect(monster.hit_points).to eq(100)
    end


    it 'has strength attribute' do
      monster = create(:monster, strength: 18)
      expect(monster.strength).to eq(18)
    end

    it 'has dexterity attribute' do
      monster = create(:monster, dexterity: 14)
      expect(monster.dexterity).to eq(14)
    end

    it 'has constitution attribute' do
      monster = create(:monster, constitution: 16)
      expect(monster.constitution).to eq(16)
    end

    it 'has intelligence attribute' do
      monster = create(:monster, intelligence: 10)
      expect(monster.intelligence).to eq(10)
    end

    it 'has wisdom attribute' do
      monster = create(:monster, wisdom: 12)
      expect(monster.wisdom).to eq(12)
    end

    it 'has charisma attribute' do
      monster = create(:monster, charisma: 8)
      expect(monster.charisma).to eq(8)
    end
  end

  describe 'PgSearch' do
    it 'is multisearchable' do
      monster = create(:monster, name: 'Owlbear')
      search_results = PgSearch.multisearch('Owlbear')
      expect(search_results.map(&:searchable).flatten).to include(monster)
    end

    it 'searches by name' do
      monster = create(:monster, name: 'Kobold')
      results = Monster.search_for('Kobold')
      expect(results).to include(monster)
    end
  end

  describe 'user association' do
    it 'can belong to a user' do
      user = create(:user)
      monster = create(:monster, user_id: user.id)
      expect(monster.user_id).to eq(user.id)
    end

    it 'can be SRD (no user)' do
      monster = create(:monster, user_id: nil)
      expect(monster.user_id).to be_nil
    end
  end

  describe '#normalize_friendly_id' do
    it 'removes apostrophes from slug' do
      monster = create(:monster, name: "Dragon's Breath")
      expect(monster.slug).not_to include("'")
    end
  end

  describe '#saving_throws' do
    let(:monster) { create(:monster) }
    let(:str_save_prof) { create(:prof, name: 'Saving Throw: STR', prof_type: 'Saving Throws') }
    let(:dex_save_prof) { create(:prof, name: 'Saving Throw: DEX', prof_type: 'Saving Throws') }

    it 'returns empty array when no saving throws' do
      expect(monster.saving_throws).to eq([])
    end

    it 'returns formatted saving throws with positive modifiers' do
      MonsterProficiency.create!(monster: monster, prof: str_save_prof, value: 5)
      expect(monster.saving_throws).to include('Str +5')
    end

    it 'returns formatted saving throws with negative modifiers' do
      MonsterProficiency.create!(monster: monster, prof: str_save_prof, value: -2)
      expect(monster.saving_throws).to include('Str --2')
    end

    it 'returns formatted saving throws with zero modifiers' do
      MonsterProficiency.create!(monster: monster, prof: str_save_prof, value: 0)
      expect(monster.saving_throws).to include('Str 0')
    end

    it 'returns multiple saving throws' do
      MonsterProficiency.create!(monster: monster, prof: str_save_prof, value: 3)
      MonsterProficiency.create!(monster: monster, prof: dex_save_prof, value: 4)
      expect(monster.saving_throws.size).to eq(2)
    end
  end

  describe '#num_saving_throws' do
    let(:monster) { create(:monster) }
    let(:str_save_prof) { create(:prof, name: 'Saving Throw: STR', prof_type: 'Saving Throws') }
    let(:dex_save_prof) { create(:prof, name: 'Saving Throw: DEX', prof_type: 'Saving Throws') }

    it 'returns 0 when no saving throws' do
      expect(monster.num_saving_throws).to eq(0)
    end

    it 'counts saving throws correctly' do
      MonsterProficiency.create!(monster: monster, prof: str_save_prof, value: 5)
      MonsterProficiency.create!(monster: monster, prof: dex_save_prof, value: 3)
      expect(monster.num_saving_throws).to eq(2)
    end
  end

  describe '#skills' do
    let(:monster) { create(:monster) }
    let(:perception_prof) { create(:prof, name: 'Skill: Perception', prof_type: 'Skills') }
    let(:stealth_prof) { create(:prof, name: 'Skill: Stealth', prof_type: 'Skills') }

    it 'returns empty array when no skills' do
      expect(monster.skills).to eq([])
    end

    it 'returns formatted skills with positive modifiers' do
      MonsterProficiency.create!(monster: monster, prof: perception_prof, value: 6)
      expect(monster.skills).to include('Perception +6')
    end

    it 'returns formatted skills with negative modifiers' do
      MonsterProficiency.create!(monster: monster, prof: stealth_prof, value: -1)
      expect(monster.skills).to include('Stealth --1')
    end

    it 'returns multiple skills' do
      MonsterProficiency.create!(monster: monster, prof: perception_prof, value: 5)
      MonsterProficiency.create!(monster: monster, prof: stealth_prof, value: 3)
      expect(monster.skills.size).to eq(2)
    end
  end

  describe '#has_perception' do
    let(:monster) { create(:monster) }
    let(:perception_prof) { create(:prof, name: 'Skill: Perception', prof_type: 'Skills') }
    let(:stealth_prof) { create(:prof, name: 'Skill: Stealth', prof_type: 'Skills') }

    it 'returns false when no perception skill' do
      expect(monster.has_perception).to be false
    end

    it 'returns true when has perception skill' do
      MonsterProficiency.create!(monster: monster, prof: perception_prof, value: 5)
      expect(monster.has_perception).to be true
    end

    it 'returns false when has other skills but not perception' do
      MonsterProficiency.create!(monster: monster, prof: stealth_prof, value: 3)
      expect(monster.has_perception).to be false
    end
  end

  describe '#senses_array' do
    let(:monster) { create(:monster) }

    it 'returns empty array when no senses' do
      expect(monster.senses_array).to eq([])
    end

    it 'formats passive perception correctly' do
      monster.senses.create!(name: 'Passive Perception', value: '15')
      expect(monster.senses_array).to include('passive Perception 15')
    end

    it 'formats other senses correctly' do
      monster.senses.create!(name: 'Darkvision', value: '60 ft.')
      expect(monster.senses_array).to include('Darkvision 60 ft.')
    end

    it 'returns multiple senses' do
      monster.senses.create!(name: 'Darkvision', value: '60 ft.')
      monster.senses.create!(name: 'Blindsight', value: '30 ft.')
      expect(monster.senses_array.size).to eq(2)
    end
  end

  describe '#speeds_array' do
    let(:monster) { create(:monster) }

    it 'returns empty array when no speeds' do
      expect(monster.speeds_array).to eq([])
    end

    it 'formats walk speed without label' do
      monster.speeds.create!(name: 'walk', value: 30)
      expect(monster.speeds_array).to include('30 ft.')
    end

    it 'formats fly speed with label' do
      monster.speeds.create!(name: 'fly', value: 60)
      expect(monster.speeds_array).to include('fly 60 ft.')
    end

    it 'formats hover as just Hover' do
      monster.speeds.create!(name: 'hover', value: 0)
      expect(monster.speeds_array).to include('Hover')
    end

    it 'returns sorted speeds' do
      monster.speeds.create!(name: 'walk', value: 30)
      monster.speeds.create!(name: 'fly', value: 60)
      monster.speeds.create!(name: 'swim', value: 20)
      speeds = monster.speeds_array
      expect(speeds).to eq(speeds.sort)
    end
  end

  describe '#hit_dice_string' do
    it 'returns empty string when hit_dice is nil' do
      monster = create(:monster, hit_dice: nil)
      expect(monster.hit_dice_string).to eq('')
    end

    it 'formats hit dice with positive constitution modifier' do
      monster = create(:monster, hit_dice: '8d10', constitution: 16)
      expect(monster.hit_dice_string).to eq('(8d10 + 24)')
    end

    it 'formats hit dice with negative constitution modifier' do
      monster = create(:monster, hit_dice: '5d8', constitution: 8)
      expect(monster.hit_dice_string).to eq('(5d8 - 5)')
    end

    it 'formats hit dice with zero constitution modifier' do
      monster = create(:monster, hit_dice: '3d6', constitution: 10)
      expect(monster.hit_dice_string).to eq('(3d6)')
    end
  end

  describe '#hit_points_string' do
    it 'returns hit points with hit dice string' do
      monster = create(:monster, hit_points: 45, hit_dice: '6d8', constitution: 12)
      result = monster.hit_points_string
      expect(result).to start_with('45')
      expect(result).to include('6d8')
    end
  end

  describe '#challenge_string' do
    it 'formats challenge rating with XP' do
      monster = create(:monster, challenge_rating: '5', xp: 1800)
      expect(monster.challenge_string).to eq('5 (1,800 XP)')
    end
  end

  describe '#is_caster' do
    let(:monster) { create(:monster) }

    it 'returns false when no special abilities' do
      monster.special_abilities.destroy_all
      expect(monster.is_caster).to be false
    end

    it 'returns true when has spellcasting ability' do
      monster.special_abilities.create!(name: 'Spellcasting', desc: 'Can cast spells')
      expect(monster.is_caster).to be true
    end

    it 'returns false when has other special abilities but not spellcasting' do
      monster.special_abilities.destroy_all
      monster.special_abilities.create!(name: 'Pack Tactics', desc: 'Advantage when ally is near')
      expect(monster.is_caster).to be false
    end
  end

  describe '#monster_atts' do
    let(:monster) { create(:monster) }

    it 'includes basic monster attributes' do
      atts = monster.monster_atts
      expect(atts['name']).to eq(monster.name)
      expect(atts['armor_class']).to eq(monster.armor_class)
    end

    it 'includes actions array' do
      atts = monster.monster_atts
      expect(atts[:actions]).to be_an(Array)
      expect(atts[:actions].size).to eq(monster.monster_actions.size)
    end

    it 'includes special abilities array' do
      atts = monster.monster_atts
      expect(atts[:special_abilities]).to be_an(Array)
    end

    it 'includes reactions array' do
      atts = monster.monster_atts
      expect(atts[:reactions]).to be_an(Array)
    end

    it 'includes legendary actions array' do
      atts = monster.monster_atts
      expect(atts[:legendary_actions]).to be_an(Array)
    end
  end

  describe '#damage_per_round' do
    let(:monster) { create(:monster, strength: 16) }

    it 'returns 1.0 when no actions with damage' do
      monster.monster_actions.destroy_all
      expect(monster.damage_per_round).to eq(1.0)
    end

    it 'calculates damage for single attack' do
      monster.monster_actions.destroy_all
      monster.monster_actions.create!(name: 'Claw', desc: 'Melee Weapon Attack: 1d6+3 slashing damage')
      dpr = monster.damage_per_round
      expect(dpr).to be > 0
    end
  end

  describe '#offensive_cr' do
    let(:monster) { create(:monster, attack_bonus: 5) }

    it 'calculates offensive CR' do
      expect(monster.offensive_cr).to be_a(Numeric)
    end
  end

  describe '#defensive_cr' do
    let(:monster) { create(:monster, armor_class: 15, hit_points: 50, challenge_rating: '3') }

    it 'calculates defensive CR' do
      expect(monster.defensive_cr).to be_a(Numeric)
    end
  end

  describe '#export' do
    let(:monster) { create(:monster) }

    it 'exports monster as XML' do
      xml = monster.export
      expect(xml).to include('<?xml version')
      expect(xml).to include('<npc>')
    end

    it 'includes monster name in XML' do
      xml = monster.export
      expect(xml).to include(monster.name)
    end

    it 'includes abilities in XML' do
      xml = monster.export
      expect(xml).to include('<abilities>')
      expect(xml).to include('<strength>')
      expect(xml).to include('<charisma>')
    end
  end

end
