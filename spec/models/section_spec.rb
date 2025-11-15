# == Schema Information
#
# Table name: sections
#
#  id          :bigint           not null, primary key
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_sections_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Section, type: :model do
  describe 'factory' do
    it 'creates a valid section' do
      section = create(:section)

      expect(section).to be_valid
      expect(section.name).to be_present
    end
  end

  describe 'friendly_id' do
    it 'generates slug from name' do
      section = create(:section, name: 'Character Creation')

      expect(section.slug).to eq('character-creation')
    end

    it 'normalizes apostrophes in slugs' do
      section = create(:section, name: "Player's Guide")

      expect(section.slug).not_to include("'")
      expect(section.slug).to eq('players-guide')
    end

    it 'finds sections by slug' do
      section = create(:section, name: 'Equipment')

      found_section = Section.friendly.find('equipment')
      expect(found_section).to eq(section)
    end

    it 'ensures slug uniqueness' do
      section1 = create(:section, name: 'Spells')
      section2 = create(:section, name: 'Spells')

      expect(section1.slug).to eq('spells')
      expect(section2.slug).not_to eq('spells')
      expect(section2.slug).to match(/spells-/)
    end
  end

  describe 'attributes' do
    let(:section) { create(:section, name: 'Combat', description: 'Rules and mechanics for combat encounters') }

    it 'stores section name' do
      expect(section.name).to eq('Combat')
    end

    it 'stores description' do
      expect(section.description).to eq('Rules and mechanics for combat encounters')
    end
  end

  describe 'uniqueness' do
    it 'allows multiple sections with different names' do
      section1 = create(:section, name: 'Magic')
      section2 = create(:section, name: 'Skills')

      expect(Section.count).to be >= 2
      expect(section1).to be_valid
      expect(section2).to be_valid
    end
  end
end
