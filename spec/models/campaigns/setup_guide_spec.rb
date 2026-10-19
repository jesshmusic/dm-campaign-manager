require 'rails_helper'

RSpec.describe SetupGuide, type: :model do
  before { seed_setup_guide }

  let(:guide) { described_class.new }

  describe '.as_json_for_api' do
    it 'lists the steps and templates in order' do
      json = described_class.as_json_for_api

      expect(json[:steps].pluck(:id)).to eq(SetupGuideStep::KEYS)
      expect(json[:templates].pluck(:value)).to eq(SetupGuideTemplate::KEYS)
    end

    it 'follows position, not when a row was made' do
      SetupGuideStep.find_by(key: 'kind').update!(position: 10)

      expect(described_class.as_json_for_api[:steps].pluck(:id).last).to eq('kind')
    end

    it 'is updated when the newest step or template was' do
      travel_to(1.day.from_now) { SetupGuideTemplate.find_by(key: 'blank').touch }

      expect(described_class.as_json_for_api[:updatedAt]).to eq(SetupGuideTemplate.find_by(key: 'blank').updated_at)
    end

    it 'is empty without any rows' do
      clear_setup_guide

      expect(described_class.as_json_for_api).to eq(steps: [], templates: [], updatedAt: nil)
    end
  end

  describe '#update' do
    it 'changes the words of the steps and templates given' do
      saved = guide.update(
        steps: [{ 'id' => 'pitch', 'title' => 'Your pitch', 'why' => '' }],
        templates: [{ 'value' => 'sandbox', 'description' => 'Go anywhere.' }]
      )

      expect(saved).to be(true)
      pitch = SetupGuideStep.find_by(key: 'pitch')
      expect([pitch.title, pitch.why]).to eq(['Your pitch', nil])
      expect(SetupGuideTemplate.find_by(key: 'sandbox').description).to eq('Go anywhere.')
    end

    it 'leaves words that were not sent alone' do
      expect { guide.update(steps: [{ 'id' => 'kind', 'label' => 'Type' }]) }
        .not_to(change { SetupGuideStep.find_by(key: 'kind').intro })
    end

    it 'never changes keys or positions' do
      guide.update(steps: [{ 'id' => 'kind', 'key' => 'epilogue', 'position' => 9, 'label' => 'Type' }])

      kind = SetupGuideStep.find_by(key: 'kind')
      expect([kind.label, kind.position]).to eq(['Type', 0])
    end

    it 'saves nothing when any change is invalid' do
      saved = guide.update(
        steps: [{ 'id' => 'kind', 'label' => 'Type' }, { 'id' => 'pitch', 'title' => '' }],
        templates: [{ 'value' => 'blank', 'description' => 'x' * 2001 }]
      )

      expect(saved).to be(false)
      expect(guide.errors).to eq(
        ["Pitch step: Title can't be blank",
         'Blank template: Description is too long (maximum is 2000 characters)']
      )
      expect(SetupGuideStep.find_by(key: 'kind').label).to eq('Kind')
    end

    it 'rejects steps and templates it does not know' do
      saved = guide.update(steps: [{ 'id' => 'epilogue', 'title' => 'The end' }, { 'title' => 'No id' }],
                           templates: [{ 'value' => 'hexcrawl', 'title' => 'Hexes' }])

      expect(saved).to be(false)
      expect(guide.errors).to eq(['Unknown step: epilogue', 'Unknown step: (none)', 'Unknown template: hexcrawl'])
    end

    it 'rolls back if saving fails part way' do
      allow(SetupGuideTemplate).to receive(:all).and_wrap_original do |original|
        original.call.each do |template|
          allow(template).to receive(:save!).and_raise(ActiveRecord::RecordInvalid.new(template))
        end
      end

      saved = guide.update(steps: [{ 'id' => 'kind', 'label' => 'Type' }],
                           templates: [{ 'value' => 'blank', 'title' => 'Empty' }])

      expect(saved).to be(false)
      expect(guide.errors).to eq(['Blank template: Could not be saved'])
      expect(SetupGuideStep.find_by(key: 'kind').label).to eq('Kind')
    end
  end
end
