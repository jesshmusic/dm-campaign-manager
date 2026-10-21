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

  describe 'Foundry scene' do
    subject(:location) { build(:campaign_location, campaign: campaign) }

    it 'has no scene by default' do
      expect(location).to have_attributes(foundry_scene_uuid: nil, foundry_scene_name: nil)
    end

    it 'links a Foundry scene by its UUID and name' do
      location.assign_attributes(foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx', foundry_scene_name: 'Mountain Pass')

      expect(location).to be_valid
    end

    it 'rejects a UUID that is not a Foundry scene' do
      ['Scene.short', 'Scene.5wVcsNPOg2RjRbFx0', 'scene.5wVcsNPOg2RjRbFx', 'Actor.5wVcsNPOg2RjRbFx',
       'Compendium.world.scenes.Scene.5wVcsNPOg2RjRbFx', 'Scene.5wVcsNPOg2RjRb-x', "Scene.5wVcsNPOg2RjRbFx\nScene.x",
       'Mountain Pass'].each do |uuid|
        location.foundry_scene_uuid = uuid

        expect(location).not_to be_valid, "expected #{uuid.inspect} to be rejected"
        expect(location.errors[:foundry_scene_uuid]).to include('is invalid')
      end
    end

    it { is_expected.to validate_length_of(:foundry_scene_name).is_at_most(120) }

    it 'stores a blank scene as none' do
      location.assign_attributes(foundry_scene_uuid: '', foundry_scene_name: '  ')

      expect(location).to be_valid
      expect(location).to have_attributes(foundry_scene_uuid: nil, foundry_scene_name: nil)
    end

    it 'trims the scene name' do
      location.foundry_scene_name = ' Mountain Pass '

      expect(location.foundry_scene_name).to eq('Mountain Pass')
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

  describe 'roll tables' do
    subject(:location) { build(:campaign_location, campaign: campaign) }

    let(:message) { 'must be up to 10 Foundry roll tables, each with a roll table UUID and a name of up to 120 characters' }

    def table(index, name: "Table #{index}")
      { uuid: "RollTable.#{index.to_s.rjust(16, 'a')}", name: name }
    end

    it 'has none by default' do
      expect(described_class.new.roll_tables).to eq([])
    end

    it 'accepts world and compendium roll tables, keeping only the uuid and name' do
      location.roll_tables = [{ uuid: 'RollTable.5wVcsNPOg2RjRbFx', name: 'Moathouse encounters', formula: '1d8' },
                              { uuid: 'Compendium.dnd5e.tables24.RollTable.5wVcsNPOg2RjRbFx', name: 'Trinkets' }]

      expect(location).to be_valid
      expect(location.roll_tables.first).to eq('uuid' => 'RollTable.5wVcsNPOg2RjRbFx', 'name' => 'Moathouse encounters')
    end

    it 'takes up to 10' do
      location.roll_tables = Array.new(MapsAndCoins::MAX_ROLL_TABLES) { |i| table(i) }
      expect(location).to be_valid

      location.roll_tables = Array.new(MapsAndCoins::MAX_ROLL_TABLES + 1) { |i| table(i) }
      expect(location).not_to be_valid
      expect(location.errors[:roll_tables]).to include(message)
    end

    it 'rejects anything that is not a roll table with a name' do
      [[{ name: 'Encounters' }], [{ uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'Journal' }],
       [{ uuid: 'RollTable.short', name: 'Short' }], [{ uuid: 'Compendium.dnd5e.RollTable.5wVcsNPOg2RjRbFx', name: 'No pack' }],
       [table(1, name: '')], [table(1, name: 'x' * 121)], 'Encounters'].each do |value|
        location.roll_tables = value

        expect(location).not_to be_valid, "expected #{value.inspect} to be rejected"
        expect(location.errors[:roll_tables]).to include(message)
      end
    end

    it 'treats none as an empty list' do
      location.roll_tables = nil

      expect(location.roll_tables).to eq([])
      expect(location).to be_valid
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the location' do
      location = create(:campaign_location, campaign: campaign, name: 'Phandalin', description: 'A frontier town',
                                            features: ['Stonehill Inn', 'Tresendar Manor'], notes: 'Redbrands')

      expect(location.as_json_for_api).to eq(
        id: location.id.to_s, uuid: location.uuid, name: 'Phandalin', description: 'A frontier town',
        features: ['Stonehill Inn', 'Tresendar Manor'], notes: 'Redbrands', parentId: nil, foundryMapId: nil,
        foundrySceneUuid: nil, foundrySceneName: nil, rollTables: []
      )
    end

    it 'includes its roll tables in order' do
      tables = [{ 'uuid' => 'RollTable.5wVcsNPOg2RjRbFx', 'name' => 'Moathouse encounters' },
                { 'uuid' => 'RollTable.abcdefghijklmnop', 'name' => 'Weather' }]
      location = create(:campaign_location, campaign: campaign, roll_tables: tables)

      expect(location.reload.as_json_for_api[:rollTables]).to eq(tables)
    end

    it 'includes the linked Foundry scene' do
      location = create(:campaign_location, campaign: campaign, foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx',
                                            foundry_scene_name: 'Mountain Pass')

      expect(location.as_json_for_api).to include(foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', foundrySceneName: 'Mountain Pass')
    end
  end
end
