require 'rails_helper'

RSpec.describe Rule, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:rule)).to be_valid
    end
  end

  describe 'associations' do
    it 'belongs_to parent (optional)' do
      rule = create(:rule)
      expect(rule).to respond_to(:parent)
    end

    it 'has_many children' do
      rule = create(:rule)
      expect(rule).to respond_to(:children)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      rule = create(:rule, name: 'Combat Rules')
      expect(rule.name).to eq('Combat Rules')
    end


    it 'has slug attribute' do
      rule = create(:rule)
      expect(rule.slug).not_to be_nil
    end
  end

  describe 'PgSearch' do
    it 'searches by name' do
      rule = create(:rule, name: 'Spellcasting')
      results = Rule.search_for('Spellcasting')
      expect(results).to include(rule)
    end
  end

  describe 'navigation methods' do
    let!(:parent1) { create(:rule, name: 'Parent 1', edition: '2024', sort_order: 1) }
    let!(:child1) { create(:rule, name: 'Child 1', edition: '2024', parent: parent1, sort_order: 1) }
    let!(:child2) { create(:rule, name: 'Child 2', edition: '2024', parent: parent1, sort_order: 2) }
    let!(:parent2) { create(:rule, name: 'Parent 2', edition: '2024', sort_order: 2) }

    before do
      # Clear the cache before each test
      Rails.cache.delete('rules_flattened_2024')
    end

    describe '.flattened_tree' do
      it 'returns rules in depth-first order' do
        result = Rule.flattened_tree('2024')
        names = result.map(&:name)

        expect(names).to eq(['Parent 1', 'Child 1', 'Child 2', 'Parent 2'])
      end

      it 'caches the result' do
        # First call should cache
        first_result = Rule.flattened_tree('2024')

        # Second call should return same result from cache
        second_result = Rule.flattened_tree('2024')

        expect(first_result.map(&:id)).to eq(second_result.map(&:id))
      end
    end

    describe '#previous_rule' do
      it 'returns nil for the first rule' do
        expect(parent1.previous_rule).to be_nil
      end

      it 'returns the previous rule in tree order' do
        expect(child1.previous_rule).to eq(parent1)
        expect(child2.previous_rule).to eq(child1)
        expect(parent2.previous_rule).to eq(child2)
      end
    end

    describe '#next_rule' do
      it 'returns nil for the last rule' do
        expect(parent2.next_rule).to be_nil
      end

      it 'returns the next rule in tree order' do
        expect(parent1.next_rule).to eq(child1)
        expect(child1.next_rule).to eq(child2)
        expect(child2.next_rule).to eq(parent2)
      end
    end
  end
end
