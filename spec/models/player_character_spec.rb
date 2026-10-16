require 'rails_helper'

RSpec.describe PlayerCharacter, type: :model do
  let(:user) { create(:dungeon_master_user) }

  def sent(name, uuid: "Actor.#{name.ljust(16, 'x').first(16)}", **extra)
    { 'uuid' => uuid, 'name' => name, 'playerName' => 'Sam', 'level' => 3,
      'sheet' => { 'summary' => "Level 3 #{name}" } }.merge(extra.transform_keys(&:to_s))
  end

  describe 'validations' do
    it 'is valid from the factory' do
      expect(build(:player_character)).to be_valid
    end

    it 'needs a world actor uuid' do
      expect(build(:player_character, foundry_uuid: 'Compendium.dnd5e.actors24.Actor.abc')).not_to be_valid
      expect(build(:player_character, foundry_uuid: 'Actor.short')).not_to be_valid
    end

    it 'needs a world id' do
      expect(build(:player_character, world_id: '')).not_to be_valid
      expect(build(:player_character, world_id: 'my world!')).not_to be_valid
    end

    it 'keeps one copy of each actor per world' do
      existing = create(:player_character, user: user)

      expect(build(:player_character, user: user, foundry_uuid: existing.foundry_uuid)).not_to be_valid
      expect(build(:player_character, user: user, foundry_uuid: existing.foundry_uuid, world_id: 'other')).to be_valid
    end

    it 'needs the sheet to be a small object' do
      expect(build(:player_character, sheet: ['list'])).not_to be_valid
      expect(build(:player_character, sheet: { 'backstory' => 'x' * 100_001 })).not_to be_valid
    end

    it 'allows levels from 0 to 30 or none' do
      expect(build(:player_character, level: nil)).to be_valid
      expect(build(:player_character, level: 31)).not_to be_valid
    end
  end

  describe '.replace_world!' do
    it "saves the world's characters" do
      count = described_class.replace_world!(user, 'greyhawk', 'Greyhawk', [sent('Akra'), sent('Borin')])

      expect(count).to eq(2)
      expect(user.player_characters.order(:name).map { |c| [c.name, c.player_name, c.level, c.world_title] })
        .to eq([['Akra', 'Sam', 3, 'Greyhawk'], ['Borin', 'Sam', 3, 'Greyhawk']])
    end

    it 'updates a character in place, so campaigns keep it in their party' do
      described_class.replace_world!(user, 'greyhawk', 'Greyhawk', [sent('Akra')])
      akra = user.player_characters.sole
      campaign = create(:campaign, user: user)
      campaign.assign_party!([akra.id])

      described_class.replace_world!(user, 'greyhawk', 'Greyhawk',
                                     [sent('Akra', level: 4, sheet: { 'summary' => 'Level 4 Akra' })])

      expect(user.player_characters.sole).to have_attributes(id: akra.id, level: 4,
                                                             sheet: { 'summary' => 'Level 4 Akra' })
      expect(campaign.party.reload).to eq([akra])
    end

    it 'removes characters no longer in the world, and from every party' do
      described_class.replace_world!(user, 'greyhawk', 'Greyhawk', [sent('Akra'), sent('Gone')])
      campaign = create(:campaign, user: user)
      campaign.assign_party!(user.player_characters.ids)

      described_class.replace_world!(user, 'greyhawk', 'Greyhawk', [sent('Akra')])

      expect(user.player_characters.pluck(:name)).to eq(['Akra'])
      expect(campaign.party.reload.map(&:name)).to eq(['Akra'])
    end

    it "leaves other worlds and other DMs' characters alone" do
      other_world = create(:player_character, user: user, world_id: 'eberron')
      other_dm = create(:player_character, world_id: 'greyhawk')

      described_class.replace_world!(user, 'greyhawk', 'Greyhawk', [])

      expect(other_world.reload).to be_persisted
      expect(other_dm.reload).to be_persisted
    end

    it 'skips characters that are not valid' do
      characters = [sent('Akra'), sent('Bad uuid', uuid: 'Actor.x'), sent('No sheet', sheet: 'text'), 'text', sent('')]

      expect(described_class.replace_world!(user, 'greyhawk', 'Greyhawk', characters)).to eq(1)
      expect(user.player_characters.pluck(:name)).to eq(['Akra'])
    end

    it 'saves no level when there is none' do
      described_class.replace_world!(user, 'greyhawk', nil, [sent('Akra', level: nil)])

      expect(user.player_characters.sole.level).to be_nil
    end
  end

  describe '.save_from_world!' do
    it "saves these characters and leaves the world's others alone" do
      other = create(:player_character, user: user, world_id: 'greyhawk')

      saved = described_class.save_from_world!(user, 'greyhawk', 'Greyhawk', [sent('Akra'), sent('Akra'), 'text'])

      expect(saved.map(&:name)).to eq(['Akra'])
      expect(user.player_characters.pluck(:name)).to contain_exactly('Akra', other.name)
    end
  end

  describe '#class_line' do
    it 'names the class and subclass' do
      expect(build(:player_character).class_line).to eq('Cleric (Life Domain)')
    end

    it 'gives each class its levels when multiclassed' do
      character = build(:player_character, sheet: { 'classes' => [{ 'name' => 'Fighter', 'levels' => 3 },
                                                                  { 'name' => 'Wizard', 'levels' => 2 }] })

      expect(character.class_line).to eq('Fighter 3 / Wizard 2')
    end

    it 'is blank without classes' do
      expect(build(:player_character, sheet: { 'classes' => 'oops' }).class_line).to eq('')
    end
  end

  describe 'JSON' do
    it 'lists who the character is, with the world, but no sheet' do
      character = create(:player_character, name: 'Akra', world_title: nil)

      expect(character.as_summary_json_for_api).to include(
        name: 'Akra', playerName: 'Sam', level: 3, classes: 'Cleric (Life Domain)', worldId: 'greyhawk',
        worldTitle: 'greyhawk'
      )
      expect(character.as_summary_json_for_api).not_to have_key(:sheet)
    end

    it 'includes the sheet in full' do
      expect(create(:player_character).as_json_for_api[:sheet]).to include('summary' => 'Level 3 Dragonborn Cleric')
    end
  end

  it 'goes when its DM is deleted' do
    character = create(:player_character, user: user)

    user.destroy!

    expect(described_class.exists?(character.id)).to be(false)
  end
end
