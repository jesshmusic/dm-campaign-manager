require 'rails_helper'

RSpec.describe SetupGuideStep, type: :model do
  before { clear_setup_guide }

  it 'has a valid factory' do
    expect(build(:setup_guide_step)).to be_valid
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:label) }
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:intro) }
    it { is_expected.to validate_length_of(:label).is_at_most(60) }
    it { is_expected.to validate_length_of(:title).is_at_most(60) }
    it { is_expected.to validate_length_of(:intro).is_at_most(2000) }
    it { is_expected.to validate_length_of(:why).is_at_most(2000) }
    it { is_expected.to validate_length_of(:example).is_at_most(2000) }

    it 'knows only the guide steps' do
      SetupGuideStep::KEYS.each { |key| expect(build(:setup_guide_step, key: key)).to be_valid }
      expect(build(:setup_guide_step, key: 'epilogue')).not_to be_valid
    end

    it 'has one row per step' do
      create(:setup_guide_step, key: 'pitch')

      expect(build(:setup_guide_step, key: 'pitch')).not_to be_valid
    end

    it 'needs a whole-number position' do
      expect(build(:setup_guide_step, position: nil)).not_to be_valid
      expect(build(:setup_guide_step, position: 1.5)).not_to be_valid
    end

    it 'leaves why and example optional' do
      expect(build(:setup_guide_step, why: nil, example: nil)).to be_valid
    end
  end

  describe 'normalizing' do
    it 'trims the words' do
      step = build(:setup_guide_step, label: ' Kind ', title: " What kind?\n", intro: ' Choose. ')

      expect([step.label, step.title, step.intro]).to eq(['Kind', 'What kind?', 'Choose.'])
    end

    it 'stores a blank why or example as nothing' do
      step = build(:setup_guide_step, why: '  ', example: '')

      expect([step.why, step.example]).to eq([nil, nil])
    end

    it 'keeps line breaks inside an example' do
      expect(build(:setup_guide_step, example: "One\nTwo\n").example).to eq("One\nTwo")
    end
  end

  describe '.ordered' do
    it 'sorts by position' do
      create(:setup_guide_step, key: 'world', position: 3)
      create(:setup_guide_step, key: 'kind', position: 0)

      expect(described_class.ordered.map(&:key)).to eq(%w[kind world])
    end
  end

  describe '#as_json_for_api' do
    it 'names the step by its key' do
      step = build(:setup_guide_step, key: 'pitch', label: 'Pitch', title: 'The pitch', intro: 'Name it.',
                                      why: nil, example: 'Zombies.')

      expect(step.as_json_for_api).to eq(
        id: 'pitch', label: 'Pitch', title: 'The pitch', intro: 'Name it.', why: nil, example: 'Zombies.'
      )
    end
  end
end
