# frozen_string_literal: true

# == Schema Information
#
# Table name: backgrounds
#
#  id                  :bigint           not null, primary key
#  ability_scores      :string           default([]), is an Array
#  description         :text
#  edition             :string           default("2024"), not null
#  equipment_option_a  :text
#  equipment_option_b  :text
#  feat_name           :string
#  homebrew            :boolean          default(FALSE), not null
#  name                :string           not null
#  skill_proficiencies :string           default([]), is an Array
#  slug                :string           not null
#  tool_proficiency    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_backgrounds_on_edition           (edition)
#  index_backgrounds_on_homebrew          (homebrew)
#  index_backgrounds_on_slug_and_edition  (slug,edition) UNIQUE
#  index_backgrounds_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Background, type: :model do
  describe 'validations' do
    it 'requires name' do
      background = build(:background, name: nil)
      expect(background).not_to be_valid
      expect(background.errors[:name]).to include("can't be blank")
    end

    it 'requires edition to be valid' do
      background = build(:background, edition: 'invalid')
      expect(background).not_to be_valid
      expect(background.errors[:edition]).to include('is not included in the list')
    end

    it 'requires unique slug within edition' do
      create(:background, name: 'Acolyte', edition: '2024')
      # FriendlyId generates unique slugs automatically, so test the database constraint directly
      background = Background.new(name: 'Acolyte Different', slug: 'acolyte', edition: '2024')
      expect(background).not_to be_valid
      expect(background.errors[:slug]).to include('has already been taken')
    end

    it 'allows same slug in different editions' do
      create(:background, name: 'Acolyte', edition: '2024')
      background = build(:background, name: 'Acolyte', edition: '2014')
      expect(background).to be_valid
    end
  end

  describe 'associations' do
    it 'belongs to user optionally' do
      background = create(:background)
      expect(background.user).to be_nil
    end

    it 'can have a user' do
      user = create(:user)
      background = create(:background, :homebrew, user: user)
      expect(background.user).to eq(user)
    end
  end

  describe 'scopes' do
    let!(:srd_background) { create(:background, homebrew: false) }
    let!(:homebrew_background) { create(:background, :homebrew) }

    it 'returns srd backgrounds' do
      expect(Background.srd).to include(srd_background)
      expect(Background.srd).not_to include(homebrew_background)
    end

    it 'returns homebrew backgrounds' do
      expect(Background.homebrew).to include(homebrew_background)
      expect(Background.homebrew).not_to include(srd_background)
    end
  end

  describe 'edition scopes' do
    let!(:background_2024) { create(:background, edition: '2024') }
    let!(:background_2014) { create(:background, edition: '2014') }

    it 'filters by edition' do
      expect(Background.for_edition('2024')).to include(background_2024)
      expect(Background.for_edition('2024')).not_to include(background_2014)
    end
  end

  describe 'friendly_id' do
    it 'generates slug from name' do
      background = create(:background, name: 'Test Background')
      expect(background.slug).to eq('test-background')
    end

    it 'removes apostrophes from slug' do
      background = create(:background, name: "Thieves' Guild Member")
      expect(background.slug).to eq('thieves-guild-member')
    end
  end

  describe 'search' do
    let!(:acolyte) { create(:background, :acolyte) }
    let!(:criminal) { create(:background, :criminal) }

    it 'searches by name' do
      results = Background.search_for('Acolyte')
      expect(results).to include(acolyte)
      expect(results).not_to include(criminal)
    end

    it 'searches by feat name' do
      results = Background.search_for('Alert')
      expect(results).to include(criminal)
      expect(results).not_to include(acolyte)
    end
  end

  describe 'array fields' do
    it 'stores ability scores as array' do
      background = create(:background, ability_scores: %w[Strength Dexterity Constitution])
      background.reload
      expect(background.ability_scores).to eq(%w[Strength Dexterity Constitution])
    end

    it 'stores skill proficiencies as array' do
      background = create(:background, skill_proficiencies: %w[Acrobatics Athletics])
      background.reload
      expect(background.skill_proficiencies).to eq(%w[Acrobatics Athletics])
    end
  end
end
