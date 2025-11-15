# == Schema Information
#
# Table name: ability_bonus_options
#
#  id         :bigint           not null, primary key
#  ability    :string
#  bonus      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  race_id    :bigint           not null
#
# Indexes
#
#  index_ability_bonus_options_on_race_id  (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (race_id => races.id)
#
require 'rails_helper'

RSpec.describe AbilityBonusOption, type: :model do
  describe 'associations' do
    it { should belong_to(:race) }
  end

  describe 'factory' do
    it 'creates a valid ability bonus option' do
      race = create(:race)
      ability_bonus = create(:ability_bonus_option, race: race)

      expect(ability_bonus).to be_valid
      expect(ability_bonus.race).to eq(race)
    end
  end

  describe 'attributes' do
    let(:race) { create(:race) }
    let(:ability_bonus) { create(:ability_bonus_option, race: race, ability: 'Strength', bonus: 2) }

    it 'stores ability name' do
      expect(ability_bonus.ability).to eq('Strength')
    end

    it 'stores bonus value' do
      expect(ability_bonus.bonus).to eq(2)
    end

    it 'belongs to a race' do
      expect(ability_bonus.race_id).to eq(race.id)
    end
  end

  describe 'multiple abilities for one race' do
    it 'allows a race to have multiple ability bonuses' do
      race = create(:race)
      bonus1 = create(:ability_bonus_option, race: race, ability: 'Strength', bonus: 2)
      bonus2 = create(:ability_bonus_option, race: race, ability: 'Constitution', bonus: 1)

      expect(race.ability_bonus_options.count).to eq(2)
      expect(race.ability_bonus_options).to include(bonus1, bonus2)
    end
  end
end
