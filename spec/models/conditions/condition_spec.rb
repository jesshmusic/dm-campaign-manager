require 'rails_helper'

RSpec.describe Condition, type: :model do
  describe 'factory' do
    it 'is valid' do
      condition = build(:condition)
      expect(condition).to be_valid
    end
  end

  describe 'associations' do
    it 'has_many condition_immunities' do
      condition = build(:condition)
      expect(condition).to respond_to(:condition_immunities)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      condition = create(:condition)
      expect(condition.name).not_to be_nil
    end

    it 'has slug attribute' do
      condition = create(:condition)
      expect(condition.slug).not_to be_nil
    end

    it 'has description attribute' do
      condition = create(:condition, description: ['Test description'])
      expect(condition.description).to eq(['Test description'])
    end
  end


  describe 'PgSearch' do
    it 'is searchable by name' do
      condition = create(:condition, name: 'Charmed')
      results = Condition.search_for('Charmed')
      expect(results).to include(condition)
    end

  end

  describe 'common conditions' do
    it 'can create Blinded condition' do
      condition = create(:condition, name: 'Blinded')
      expect(condition.name).to eq('Blinded')
    end

    it 'can create Charmed condition' do
      condition = create(:condition, name: 'Charmed')
      expect(condition.name).to eq('Charmed')
    end

    it 'can create Deafened condition' do
      condition = create(:condition, name: 'Deafened')
      expect(condition.name).to eq('Deafened')
    end

    it 'can create Exhaustion condition' do
      condition = create(:condition, name: 'Exhaustion')
      expect(condition.name).to eq('Exhaustion')
    end

    it 'can create Frightened condition' do
      condition = create(:condition, name: 'Frightened')
      expect(condition.name).to eq('Frightened')
    end

    it 'can create Grappled condition' do
      condition = create(:condition, name: 'Grappled')
      expect(condition.name).to eq('Grappled')
    end

    it 'can create Incapacitated condition' do
      condition = create(:condition, name: 'Incapacitated')
      expect(condition.name).to eq('Incapacitated')
    end

    it 'can create Invisible condition' do
      condition = create(:condition, name: 'Invisible')
      expect(condition.name).to eq('Invisible')
    end

    it 'can create Paralyzed condition' do
      condition = create(:condition, name: 'Paralyzed')
      expect(condition.name).to eq('Paralyzed')
    end

    it 'can create Petrified condition' do
      condition = create(:condition, name: 'Petrified')
      expect(condition.name).to eq('Petrified')
    end

    it 'can create Poisoned condition' do
      condition = create(:condition, name: 'Poisoned')
      expect(condition.name).to eq('Poisoned')
    end

    it 'can create Prone condition' do
      condition = create(:condition, name: 'Prone')
      expect(condition.name).to eq('Prone')
    end

    it 'can create Restrained condition' do
      condition = create(:condition, name: 'Restrained')
      expect(condition.name).to eq('Restrained')
    end

    it 'can create Stunned condition' do
      condition = create(:condition, name: 'Stunned')
      expect(condition.name).to eq('Stunned')
    end

    it 'can create Unconscious condition' do
      condition = create(:condition, name: 'Unconscious')
      expect(condition.name).to eq('Unconscious')
    end
  end

  describe 'condition persistence' do
    it 'persists condition attributes' do
      condition = create(:condition,
                        name: 'Test Condition',
                        description: ['Test description'])

      reloaded = Condition.find(condition.id)
      expect(reloaded.name).to eq('Test Condition')
      expect(reloaded.description).to eq(['Test description'])
    end
  end
end
