require 'rails_helper'

RSpec.describe CampaignLocation, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_location, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }

    it 'accepts up to 20 features' do
      subject.features = Array.new(CampaignLocation::MAX_FEATURES) { |i| "Feature #{i}" }

      expect(subject).to be_valid
    end

    it 'rejects too many features' do
      subject.features = Array.new(CampaignLocation::MAX_FEATURES + 1) { |i| "Feature #{i}" }

      expect(subject).not_to be_valid
      expect(subject.errors[:features]).to include('must be a list of up to 20 entries')
    end

    it 'rejects features that are not a list of strings' do
      subject.features = ['Altar', 42]
      expect(subject).not_to be_valid

      subject.features = 'Altar'
      expect(subject).not_to be_valid
    end

    it 'can link a map' do
      map = create(:foundry_map)
      subject.foundry_map = map

      expect(subject).to be_valid
      expect(subject.as_json_for_api[:foundryMapId]).to eq(map.id.to_s)
    end

    it 'rejects a map that does not exist' do
      subject.foundry_map_id = 0

      expect(subject).not_to be_valid
      expect(subject.errors[:foundry_map]).to include('must exist')
    end
  end

  describe 'nesting' do
    let(:city) { create(:campaign_location, campaign: campaign, name: 'Waterdeep') }
    let(:ward) { create(:campaign_location, campaign: campaign, name: 'Dock Ward', parent: city) }
    let(:tavern) { create(:campaign_location, campaign: campaign, name: 'Yawning Portal', parent: ward) }

    it 'nests under a parent in the same campaign' do
      expect(tavern.parent).to eq(ward)
      expect(tavern.as_json_for_api[:parentId]).to eq(ward.id.to_s)
    end

    it 'rejects a parent from another campaign' do
      location = build(:campaign_location, campaign: campaign, parent: create(:campaign_location))

      expect(location).not_to be_valid
      expect(location.errors[:parent]).to include('must belong to the same campaign')
    end

    it 'rejects a parent that does not exist' do
      location = build(:campaign_location, campaign: campaign, parent_id: 0)

      expect(location).not_to be_valid
      expect(location.errors[:parent]).to include('must exist')
    end

    it 'cannot be its own parent' do
      city.parent = city

      expect(city).not_to be_valid
      expect(city.errors[:parent]).to include("can't be this location or one inside it")
    end

    it 'cannot move inside one of its own descendants' do
      city.parent = tavern

      expect(city).not_to be_valid
      expect(city.errors[:parent]).to include("can't be this location or one inside it")
    end

    it 'can move to another branch' do
      other_city = create(:campaign_location, campaign: campaign, name: 'Neverwinter')
      tavern.parent = other_city

      expect(tavern).to be_valid
    end

    it 'does not loop forever on an existing cycle above it' do
      a = create(:campaign_location, campaign: campaign)
      b = create(:campaign_location, campaign: campaign, parent: a)
      a.update_column(:parent_id, b.id) # rubocop:disable Rails/SkipsModelValidations
      location = create(:campaign_location, campaign: campaign)
      location.parent = a

      expect(location).to be_valid
    end

    it 'keeps its children (unnested) when destroyed' do
      tavern
      ward.destroy!

      expect(tavern.reload.parent_id).to be_nil
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the location' do
      location = create(:campaign_location, campaign: campaign, name: 'Phandalin', description: 'A frontier town',
                                            features: ['Stonehill Inn', 'Tresendar Manor'], notes: 'Redbrands')

      expect(location.as_json_for_api).to eq(
        id: location.id.to_s, uuid: location.uuid, name: 'Phandalin', description: 'A frontier town',
        features: ['Stonehill Inn', 'Tresendar Manor'], notes: 'Redbrands', parentId: nil, foundryMapId: nil
      )
    end
  end
end
