require 'rails_helper'

RSpec.describe WeaponItem, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:weapon_item)).to be_valid
    end
  end

  describe '#category' do
    it 'returns Weapon' do
      weapon = build(:weapon_item)
      expect(weapon.category).to eq('Weapon')
    end
  end

  describe '#properties_str' do
    context 'with no properties' do
      it 'returns empty string' do
        weapon = build(:weapon_item, properties: [])
        expect(weapon.properties_str).to eq('')
      end
    end

    context 'with basic property' do
      it 'returns property name' do
        weapon = build(:weapon_item, properties: ['Light'])
        expect(weapon.properties_str).to eq('Light')
      end
    end

    context 'with multiple properties' do
      it 'returns comma-separated properties' do
        weapon = build(:weapon_item, properties: ['Light', 'Finesse'])
        expect(weapon.properties_str).to eq('Light, Finesse')
      end
    end

    context 'with thrown property' do
      it 'includes throw range when present' do
        throw_range = double('Range', normal: 20, long: 60)
        weapon = build(:weapon_item, properties: ['Thrown'])
        allow(weapon).to receive(:item_throw_range).and_return(throw_range)

        expect(weapon.properties_str).to eq('Thrown (range 20/60)')
      end

      it 'returns just property name when throw range is nil' do
        weapon = build(:weapon_item, properties: ['Thrown'])
        allow(weapon).to receive(:item_throw_range).and_return(nil)

        expect(weapon.properties_str).to eq('Thrown')
      end
    end

    context 'with ammunition property' do
      it 'includes range when present' do
        range = double('Range', normal: 80, long: 320)
        weapon = build(:weapon_item, properties: ['Ammunition'])
        allow(weapon).to receive(:item_range).and_return(range)

        expect(weapon.properties_str).to eq('Ammunition (range 80/320)')
      end

      it 'returns just property name when range is nil' do
        weapon = build(:weapon_item, properties: ['Ammunition'])
        allow(weapon).to receive(:item_range).and_return(nil)

        expect(weapon.properties_str).to eq('Ammunition')
      end
    end

    context 'with versatile property' do
      it 'includes two-handed damage when present' do
        two_handed = double('Damage', damage_dice: '1d10')
        weapon = build(:weapon_item, properties: ['Versatile'])
        allow(weapon).to receive(:two_handed_damage).and_return(two_handed)

        expect(weapon.properties_str).to eq('Versatile (1d10)')
      end

      it 'returns just property name when two-handed damage is nil' do
        weapon = build(:weapon_item, properties: ['Versatile'])
        allow(weapon).to receive(:two_handed_damage).and_return(nil)

        expect(weapon.properties_str).to eq('Versatile')
      end
    end
  end

  describe '.all_weapons' do
    it 'returns an array of weapon names' do
      expect(WeaponItem.all_weapons).to be_an(Array)
      expect(WeaponItem.all_weapons).to include('Longsword', 'Dagger', 'Longbow')
    end

    it 'includes 37 weapons' do
      expect(WeaponItem.all_weapons.size).to eq(37)
    end
  end

  describe '.melee_weapons' do
    it 'returns melee weapons only' do
      melee = WeaponItem.melee_weapons
      expect(melee).to include('Longsword', 'Dagger', 'Greatsword')
      expect(melee).not_to include('Longbow', 'Crossbow, heavy')
    end

    it 'includes 28 melee weapons' do
      expect(WeaponItem.melee_weapons.size).to eq(28)
    end
  end

  describe '.ranged_weapons' do
    it 'returns ranged weapons only' do
      ranged = WeaponItem.ranged_weapons
      expect(ranged).to include('Longbow', 'Shortbow', 'Crossbow, light')
      expect(ranged).not_to include('Longsword', 'Dagger')
    end

    it 'includes 8 ranged weapons' do
      expect(WeaponItem.ranged_weapons.size).to eq(8)
    end
  end

  describe '.fighter_weapons' do
    it 'returns a WeightedList' do
      expect(WeaponItem.fighter_weapons).to be_a(WeightedList)
    end

    it 'includes common fighter weapons' do
      sample = WeaponItem.fighter_weapons.sample.to_s
      expect(WeaponItem.all_weapons).to include(sample)
    end
  end

  describe '.rogue_weapons' do
    it 'returns a WeightedList' do
      expect(WeaponItem.rogue_weapons).to be_a(WeightedList)
    end

    it 'favors finesse weapons' do
      samples = Array.new(10) { WeaponItem.rogue_weapons.sample }
      expect(samples).to include(:Dagger).or include(:Shortsword).or include(:Rapier)
    end
  end

  describe '.caster_weapons' do
    it 'returns a WeightedList' do
      expect(WeaponItem.caster_weapons).to be_a(WeightedList)
    end

    it 'favors simple weapons' do
      samples = Array.new(10) { WeaponItem.caster_weapons.sample }
      expect(samples).to include(:Quarterstaff).or include(:Dagger)
    end
  end

  describe '.ranged_weighted' do
    it 'returns a WeightedList' do
      expect(WeaponItem.ranged_weighted).to be_a(WeightedList)
    end

    it 'samples ranged weapons' do
      sample = WeaponItem.ranged_weighted.sample.to_s
      expect(WeaponItem.ranged_weapons).to include(sample)
    end
  end

  describe '.all_swords' do
    it 'returns sword names' do
      swords = WeaponItem.all_swords
      expect(swords).to include('Longsword', 'Shortsword', 'Greatsword')
    end

    it 'includes 5 swords' do
      expect(WeaponItem.all_swords.size).to eq(5)
    end
  end

  describe '.all_axes' do
    it 'returns axe names' do
      axes = WeaponItem.all_axes
      expect(axes).to include('Battleaxe', 'Greataxe', 'Handaxe')
    end

    it 'includes 3 axes' do
      expect(WeaponItem.all_axes.size).to eq(3)
    end
  end

  describe '.basic_magic_weapons' do
    it 'returns an array of magic weapon names' do
      expect(WeaponItem.basic_magic_weapons).to be_an(Array)
      expect(WeaponItem.basic_magic_weapons.first).to include('+')
    end

    it 'includes weapons with +1, +2, +3 bonuses' do
      magic_weapons = WeaponItem.basic_magic_weapons
      expect(magic_weapons).to include('Longsword +1')
      expect(magic_weapons).to include('Dagger +2')
      expect(magic_weapons).to include('Greatsword +3')
    end

    it 'has a large number of magic weapons' do
      expect(WeaponItem.basic_magic_weapons.size).to be > 100
    end
  end

  describe 'attributes' do
    it 'has weapon-specific attributes' do
      weapon = create(:weapon_item,
                     name: 'Longsword',
                     weapon_category: 'Martial Melee',
                     weapon_range: 'Melee',
                     properties: ['Versatile'])

      expect(weapon.name).to eq('Longsword')
      expect(weapon.weapon_category).to eq('Martial Melee')
      expect(weapon.weapon_range).to eq('Melee')
      expect(weapon.properties).to include('Versatile')
    end
  end
end
