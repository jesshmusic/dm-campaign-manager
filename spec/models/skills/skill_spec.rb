require 'rails_helper'

RSpec.describe Skill, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:skill)).to be_valid
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      skill = create(:skill, name: 'Acrobatics')
      expect(skill.name).to eq('Acrobatics')
    end

    it 'has desc attribute' do
      skill = create(:skill, desc: 'Balance and coordination')
      expect(skill.desc).to eq('Balance and coordination')
    end

    it 'has ability_score attribute' do
      skill = create(:skill, ability_score: 'Dexterity')
      expect(skill.ability_score).to eq('Dexterity')
    end

    it 'has slug attribute' do
      skill = create(:skill)
      expect(skill.slug).not_to be_nil
    end
  end

  describe 'PgSearch' do
    it 'searches by name' do
      skill = create(:skill, name: 'Stealth')
      results = Skill.search_for('Stealth')
      expect(results).to include(skill)
    end
  end

end
