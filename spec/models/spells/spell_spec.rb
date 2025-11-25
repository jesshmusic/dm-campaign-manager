require 'rails_helper'

RSpec.describe Spell, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:spell)).to be_valid
    end
  end

  describe 'associations' do
    it 'has_many spell_classes' do
      spell = create(:spell)
      expect(spell).to respond_to(:spell_classes)
    end

    it 'has_many dnd_classes through spell_classes' do
      spell = create(:spell)
      expect(spell).to respond_to(:dnd_classes)
    end

    it 'belongs_to user (optional)' do
      spell = create(:spell)
      expect(spell).to respond_to(:user)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      spell = create(:spell, name: 'Fireball')
      expect(spell.name).to eq('Fireball')
    end

    it 'has level attribute' do
      spell = create(:spell, level: 3)
      expect(spell.level).to eq(3)
    end

    it 'has school attribute' do
      spell = create(:spell, school: 'Evocation')
      expect(spell.school).to eq('Evocation')
    end

    it 'has casting_time attribute' do
      spell = create(:spell, casting_time: '1 action')
      expect(spell.casting_time).to eq('1 action')
    end

    it 'has range attribute' do
      spell = create(:spell, range: '150 feet')
      expect(spell.range).to eq('150 feet')
    end

    it 'has duration attribute' do
      spell = create(:spell, duration: 'Instantaneous')
      expect(spell.duration).to eq('Instantaneous')
    end

    it 'has ritual attribute' do
      spell = create(:spell, ritual: true)
      expect(spell.ritual).to be true
    end

    it 'has concentration attribute' do
      spell = create(:spell, concentration: true)
      expect(spell.concentration).to be true
    end
  end

  describe 'PgSearch' do
    it 'is multisearchable' do
      spell = create(:spell, name: 'Magic Missile')
      search_results = PgSearch.multisearch('Magic Missile')
      expect(search_results.map(&:searchable).flatten).to include(spell)
    end

    it 'searches by name' do
      spell = create(:spell, name: 'Cure Wounds')
      results = Spell.search_for('Cure Wounds')
      expect(results).to include(spell)
    end
  end

  describe 'user association' do
    it 'can belong to a user' do
      user = create(:user)
      spell = create(:spell, user_id: user.id)
      expect(spell.user_id).to eq(user.id)
    end

    it 'can be SRD (no user)' do
      spell = create(:spell, user_id: nil)
      expect(spell.user_id).to be_nil
    end
  end

  describe 'validations' do
    it 'validates presence of name' do
      spell = build(:spell, name: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:name]).to include("can't be blank")
    end

    it 'validates presence of level' do
      spell = build(:spell, level: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:level]).to include("can't be blank")
    end

    it 'validates presence of casting_time' do
      spell = build(:spell, casting_time: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:casting_time]).to include("can't be blank")
    end

    it 'validates presence of duration' do
      spell = build(:spell, duration: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:duration]).to include("can't be blank")
    end

    it 'validates presence of range' do
      spell = build(:spell, range: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:range]).to include("can't be blank")
    end

    it 'validates presence of school' do
      spell = build(:spell, school: nil)
      expect(spell).not_to be_valid
      expect(spell.errors[:school]).to include("can't be blank")
    end
  end

  describe '#normalize_friendly_id' do
    it 'removes apostrophes from slug' do
      spell = create(:spell, name: "Mordenkainen's Sword")
      expect(spell.slug).not_to include("'")
    end
  end

  describe '#get_spell_level_text' do
    it 'returns "Cantrip" for level 0' do
      spell = build(:spell, level: 0)
      expect(spell.get_spell_level_text).to eq('Cantrip')
    end

    it 'returns "1st level" for level 1' do
      spell = build(:spell, level: 1)
      expect(spell.get_spell_level_text).to eq('1st level')
    end

    it 'returns "2nd level" for level 2' do
      spell = build(:spell, level: 2)
      expect(spell.get_spell_level_text).to eq('2nd level')
    end

    it 'returns "3rd level" for level 3' do
      spell = build(:spell, level: 3)
      expect(spell.get_spell_level_text).to eq('3rd level')
    end

    it 'returns "4th level" for level 4' do
      spell = build(:spell, level: 4)
      expect(spell.get_spell_level_text).to eq('4th level')
    end

    it 'returns "9th level" for level 9' do
      spell = build(:spell, level: 9)
      expect(spell.get_spell_level_text).to eq('9th level')
    end
  end

  describe '#spell_classes' do
    let(:user) { create(:user) }
    let(:spell) { create(:spell) }
    let(:srd_class) { create(:dnd_class, user_id: nil, name: 'Wizard') }
    let(:custom_class) { create(:dnd_class, user_id: user.id, name: 'Custom Class') }
    let(:other_user_class) { create(:dnd_class, user_id: create(:user).id, name: 'Other Class') }

    before do
      spell.dnd_classes << srd_class
      spell.dnd_classes << custom_class
      spell.dnd_classes << other_user_class
    end

    it 'returns only SRD classes when no current_user' do
      spell.current_user = nil
      classes = spell.spell_classes
      expect(classes).to include('Wizard')
      expect(classes).not_to include('Custom Class')
      expect(classes).not_to include('Other Class')
    end

    it 'returns SRD and current user classes when current_user is set' do
      spell.current_user = user
      classes = spell.spell_classes
      expect(classes).to include('Wizard')
      expect(classes).to include('Custom Class')
      expect(classes).not_to include('Other Class')
    end
  end

  describe '#description_text' do
    let(:spell) do
      create(:spell,
             name: 'Fireball',
             spell_level: '3rd level',
             school: 'Evocation',
             ritual: false,
             range: '150 feet',
             components: ['V', 'S', 'M'],
             material: 'A tiny ball of bat guano and sulfur',
             concentration: false,
             duration: 'Instantaneous',
             casting_time: '1 action',
             description: 'A bright streak flashes from your pointing finger.',
             higher_level: 'When you cast this spell using a spell slot of 4th level or higher...')
    end

    it 'returns HTML formatted description' do
      result = spell.description_text
      expect(result).to include('<div class="p-3">')
      expect(result).to include('</div>')
    end

    it 'includes spell level and school' do
      result = spell.description_text
      expect(result).to include('3rd level')
      expect(result).to include('Evocation')
    end

    it 'includes range' do
      result = spell.description_text
      expect(result).to include('Range')
      expect(result).to include('150 feet')
    end

    it 'includes components' do
      result = spell.description_text
      expect(result).to include('Components')
      expect(result).to include('V, S, M')
    end

    it 'includes material' do
      result = spell.description_text
      expect(result).to include('Material')
      expect(result).to include('bat guano')
    end

    it 'includes duration' do
      result = spell.description_text
      expect(result).to include('Duration')
      expect(result).to include('Instantaneous')
    end

    it 'includes casting time' do
      result = spell.description_text
      expect(result).to include('Casting time')
      expect(result).to include('1 action')
    end

    it 'includes description' do
      result = spell.description_text
      expect(result).to include('A bright streak flashes')
    end

    it 'includes higher level effects when present' do
      result = spell.description_text
      expect(result).to include('Higher Level Effects')
      expect(result).to include('4th level or higher')
    end

    it 'shows ritual tag when ritual is true' do
      spell.ritual = true
      result = spell.description_text
      expect(result).to include('(ritual)')
    end

    it 'shows concentration in duration when concentration is true' do
      spell.concentration = true
      result = spell.description_text
      expect(result).to include('Concentration,')
    end

    it 'does not show higher level section when higher_level is blank' do
      spell.higher_level = ''
      result = spell.description_text
      expect(result).not_to include('Higher Level Effects')
    end

    it 'does not show higher level section when higher_level is nil' do
      spell.higher_level = nil
      result = spell.description_text
      expect(result).not_to include('Higher Level Effects')
    end
  end

end
