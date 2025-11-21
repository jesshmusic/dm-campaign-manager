require 'rails_helper'

RSpec.describe DndClass, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:dnd_class)).to be_valid
    end
  end

  describe 'associations' do
    it 'has_many ability_score_dnd_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:ability_score_dnd_classes)
    end

    it 'has_many ability_scores through ability_score_dnd_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:ability_scores)
    end

    it 'has_many dnd_class_levels' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:dnd_class_levels)
    end

    it 'has_many equipments' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:equipments)
    end

    it 'has_many starting_equipment_options' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:starting_equipment_options)
    end

    it 'has_many prof_choices' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:prof_choices)
    end

    it 'has_many prof_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:prof_classes)
    end

    it 'has_many profs through prof_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:profs)
    end

    it 'has_one multi_classing' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:multi_classing)
    end

    it 'has_one spell_casting' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:spell_casting)
    end

    it 'has_many spell_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:spell_classes)
    end

    it 'has_many spells through spell_classes' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:spells)
    end

    it 'belongs_to user (optional)' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:user)
    end

    it 'destroys dependent dnd_class_levels' do
      dnd_class = create(:dnd_class)
      level = create(:dnd_class_level, dnd_class: dnd_class)

      expect { dnd_class.destroy }.to change { DndClassLevel.count }.by(-1)
    end

    it 'destroys dependent equipments' do
      dnd_class = create(:dnd_class)
      equipment = create(:equipment, dnd_class: dnd_class)

      expect { dnd_class.destroy }.to change { Equipment.count }.by(-1)
    end

  end

  describe '#normalize_friendly_id' do
    it 'removes apostrophes from friendly_id' do
      dnd_class = create(:dnd_class, name: "Barbarian's Path")
      expect(dnd_class.slug).not_to include("'")
    end
  end

  describe 'accepts_nested_attributes_for' do
    it 'accepts nested attributes for dnd_class_levels' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:dnd_class_levels_attributes=)
    end

    it 'accepts nested attributes for equipments' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:equipments_attributes=)
    end

    it 'accepts nested attributes for multi_classing' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:multi_classing_attributes=)
    end

    it 'accepts nested attributes for prof_choices' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:prof_choices_attributes=)
    end

    it 'accepts nested attributes for spell_casting' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:spell_casting_attributes=)
    end

    it 'accepts nested attributes for starting_equipment_options' do
      dnd_class = create(:dnd_class)
      expect(dnd_class).to respond_to(:starting_equipment_options_attributes=)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      dnd_class = create(:dnd_class, name: 'Wizard')
      expect(dnd_class.name).to eq('Wizard')
    end

    it 'has hit_die attribute' do
      dnd_class = create(:dnd_class, hit_die: 6)
      expect(dnd_class.hit_die).to eq(6)
    end

    it 'has spell_ability attribute' do
      dnd_class = create(:dnd_class, spell_ability: 'Intelligence')
      expect(dnd_class.spell_ability).to eq('Intelligence')
    end

    it 'has subclasses array attribute' do
      dnd_class = create(:dnd_class, subclasses: ['Evocation', 'Transmutation'])
      expect(dnd_class.subclasses).to include('Evocation')
      expect(dnd_class.subclasses).to include('Transmutation')
    end

    it 'has empty subclasses array by default' do
      dnd_class = create(:dnd_class)
      expect(dnd_class.subclasses).to eq([])
    end
  end


  describe 'PgSearch' do
    it 'is multisearchable' do
      dnd_class = create(:dnd_class, name: 'Paladin')
      search_results = PgSearch.multisearch('Paladin')
      expect(search_results.map(&:searchable).flatten).to include(dnd_class)
    end

    it 'searches by name' do
      dnd_class = create(:dnd_class, name: 'Druid')
      results = DndClass.search_for('Druid')
      expect(results).to include(dnd_class)
    end
  end

  describe 'user association' do
    it 'can have a user' do
      user = create(:user)
      dnd_class = create(:dnd_class, user_id: user.id)
      expect(dnd_class.user_id).to eq(user.id)
    end

    it 'can be SRD (no user)' do
      dnd_class = create(:dnd_class, user_id: nil)
      expect(dnd_class.user_id).to be_nil
    end
  end

end
