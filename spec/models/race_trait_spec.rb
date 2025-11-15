# == Schema Information
#
# Table name: race_traits
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  race_id    :bigint           not null
#
# Indexes
#
#  index_race_traits_on_race_id  (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (race_id => races.id)
#
require 'rails_helper'

RSpec.describe RaceTrait, type: :model do
  describe 'associations' do
    it { should belong_to(:race) }
  end

  describe 'factory' do
    it 'creates a valid race trait' do
      race = create(:race)
      trait = create(:race_trait, race: race)

      expect(trait).to be_valid
      expect(trait.race).to eq(race)
    end
  end

  describe 'attributes' do
    let(:race) { create(:race) }
    let(:trait) { create(:race_trait, race: race, name: 'Darkvision', desc: ['You can see in dim light']) }

    it 'stores trait name' do
      expect(trait.name).to eq('Darkvision')
    end

    it 'stores description as an array' do
      expect(trait.desc).to be_an(Array)
      expect(trait.desc.first).to eq('You can see in dim light')
    end

    it 'belongs to a race' do
      expect(trait.race_id).to eq(race.id)
    end
  end

  describe 'description array' do
    it 'can store multiple description paragraphs' do
      race = create(:race)
      trait = create(:race_trait, race: race, desc: ['First paragraph', 'Second paragraph', 'Third paragraph'])

      expect(trait.desc.count).to eq(3)
      expect(trait.desc).to include('First paragraph', 'Second paragraph', 'Third paragraph')
    end

    it 'defaults to an empty array' do
      race = create(:race)
      trait = RaceTrait.create(name: 'Test Trait', race: race)

      expect(trait.desc).to eq([])
    end
  end

  describe 'multiple traits for one race' do
    it 'allows a race to have multiple traits' do
      race = create(:race)
      trait1 = create(:race_trait, race: race, name: 'Darkvision')
      trait2 = create(:race_trait, race: race, name: 'Fey Ancestry')

      expect(race.race_traits.count).to eq(2)
      expect(race.race_traits).to include(trait1, trait2)
    end
  end
end
