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

end
