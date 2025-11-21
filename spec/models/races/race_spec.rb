require 'rails_helper'

RSpec.describe Race, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:race)).to be_valid
    end
  end

  describe 'associations' do
    it 'belongs_to user (optional)' do
      race = create(:race)
      expect(race).to respond_to(:user)
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      race = create(:race, name: 'Elf')
      expect(race.name).to eq('Elf')
    end

    it 'has speed attribute' do
      race = create(:race, speed: 30)
      expect(race.speed).to eq(30)
    end

    it 'has size attribute' do
      race = create(:race, size: 'Medium')
      expect(race.size).to eq('Medium')
    end

    it 'has alignment attribute' do
      race = create(:race, alignment: 'Chaotic Good')
      expect(race.alignment).to eq('Chaotic Good')
    end

    it 'has age attribute' do
      race = create(:race, age: 'Elves can live over 700 years')
      expect(race.age).to eq('Elves can live over 700 years')
    end

  end

  describe 'PgSearch' do
    it 'is multisearchable' do
      race = create(:race, name: 'Dwarf')
      search_results = PgSearch.multisearch('Dwarf')
      expect(search_results.map(&:searchable).flatten).to include(race)
    end

    it 'searches by name' do
      race = create(:race, name: 'Halfling')
      results = Race.search_for('Halfling')
      expect(results).to include(race)
    end
  end

  describe 'user association' do
    it 'can belong to a user' do
      user = create(:user)
      race = create(:race, user_id: user.id)
      expect(race.user_id).to eq(user.id)
    end

    it 'can be SRD (no user)' do
      race = create(:race, user_id: nil)
      expect(race.user_id).to be_nil
    end
  end

end
