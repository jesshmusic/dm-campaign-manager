# == Schema Information
#
# Table name: skills
#
#  id            :bigint           not null, primary key
#  ability_score :string
#  desc          :string
#  name          :string
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_skills_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Skill, type: :model do
  describe 'factory' do
    it 'creates a valid skill' do
      skill = create(:skill)

      expect(skill).to be_valid
      expect(skill.name).to be_present
    end
  end

  describe 'friendly_id' do
    it 'generates slug from name' do
      skill = create(:skill, name: 'Animal Handling')

      expect(skill.slug).to eq('animal-handling')
    end

    it 'normalizes apostrophes in slugs' do
      skill = create(:skill, name: "Sleight of Hand's Test")

      expect(skill.slug).not_to include("'")
      expect(skill.slug).to eq('sleight-of-hands-test')
    end

    it 'finds skills by slug' do
      skill = create(:skill, name: 'Perception')

      found_skill = Skill.friendly.find('perception')
      expect(found_skill).to eq(skill)
    end
  end

  describe 'attributes' do
    let(:skill) { create(:skill, name: 'Stealth', ability_score: 'Dexterity', desc: 'Make a Dexterity (Stealth) check') }

    it 'stores skill name' do
      expect(skill.name).to eq('Stealth')
    end

    it 'stores ability score' do
      expect(skill.ability_score).to eq('Dexterity')
    end

    it 'stores description' do
      expect(skill.desc).to eq('Make a Dexterity (Stealth) check')
    end
  end

  describe 'search functionality' do
    before do
      create(:skill, name: 'Perception', desc: 'Your ability to notice things')
      create(:skill, name: 'Investigation', desc: 'Your ability to deduce clues')
      create(:skill, name: 'Stealth', desc: 'Your ability to hide')
    end

    it 'searches by name' do
      results = Skill.search_for('Perception')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Perception')
    end

    it 'searches by description' do
      results = Skill.search_for('hide')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Stealth')
    end

    it 'uses prefix search' do
      results = Skill.search_for('Inv')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Investigation')
    end
  end

  describe 'multisearchable' do
    it 'is included in PgSearch multisearch' do
      skill = create(:skill, name: 'Acrobatics', desc: 'Your ability to perform acrobatic stunts')

      # The skill should be searchable via PgSearch multisearch
      expect(PgSearch::Document.where(searchable_type: 'Skill', searchable_id: skill.id).count).to eq(1)
    end
  end
end
