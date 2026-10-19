require 'rails_helper'

RSpec.describe SetupGuideTemplate, type: :model do
  before { clear_setup_guide }

  it 'has a valid factory' do
    expect(build(:setup_guide_template)).to be_valid
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_length_of(:title).is_at_most(60) }
    it { is_expected.to validate_length_of(:description).is_at_most(2000) }
    it { is_expected.to validate_length_of(:example).is_at_most(2000) }

    it 'knows only the campaign templates' do
      SetupGuideTemplate::KEYS.each { |key| expect(build(:setup_guide_template, key: key)).to be_valid }
      expect(build(:setup_guide_template, key: 'hexcrawl')).not_to be_valid
    end

    it 'covers every template a campaign can be made from' do
      expect(SetupGuideTemplate::KEYS).to match_array(CampaignTemplate::TEMPLATES)
    end

    it 'has one row per template' do
      create(:setup_guide_template, key: 'sandbox')

      expect(build(:setup_guide_template, key: 'sandbox')).not_to be_valid
    end

    it 'needs a whole-number position' do
      expect(build(:setup_guide_template, position: nil)).not_to be_valid
    end
  end

  describe 'normalizing' do
    it 'trims the words' do
      template = build(:setup_guide_template, title: ' Sandbox ', description: ' Open. ', example: ' Roam. ')

      expect([template.title, template.description, template.example]).to eq(%w[Sandbox Open. Roam.])
    end

    it 'keeps a missing example as an empty one' do
      template = create(:setup_guide_template, example: nil)

      expect(template.reload.example).to eq('')
    end
  end

  describe '.ordered' do
    it 'sorts by position' do
      create(:setup_guide_template, key: 'blank', position: 3)
      create(:setup_guide_template, key: 'three_act', position: 0)

      expect(described_class.ordered.map(&:key)).to eq(%w[three_act blank])
    end
  end

  describe '#as_json_for_api' do
    it 'names the template by its key' do
      template = build(:setup_guide_template, key: 'five_room', title: 'One-shot', description: 'Five rooms.',
                                              example: 'A lighthouse.')

      expect(template.as_json_for_api).to eq(
        value: 'five_room', title: 'One-shot', description: 'Five rooms.', example: 'A lighthouse.'
      )
    end
  end
end
