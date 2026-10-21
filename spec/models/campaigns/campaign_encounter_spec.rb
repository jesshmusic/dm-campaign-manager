require 'rails_helper'

RSpec.describe CampaignEncounter, type: :model do
  let(:campaign) { create(:campaign) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }

  describe 'validations' do
    subject(:encounter) { build(:campaign_encounter, quest: quest) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:kind).in_array(CampaignEncounter::KINDS) }

    it 'defaults to a fight, first in its quest, with no maps or reward' do
      expect(described_class.new).to have_attributes(kind: 'combat', position: 0, foundry_scenes: [], reward_currency: {},
                                                     reward_xp: nil)
    end

    it 'has every kind of encounter' do
      expect(CampaignEncounter::KINDS).to eq(%w[combat social exploration puzzle trap other])
    end

    it "is in its quest's campaign" do
      encounter = described_class.new(quest: quest, name: 'Ambush')

      expect(encounter).to be_valid
      expect(encounter.campaign).to eq(campaign)
    end

    it 'needs a quest from its campaign' do
      expect(build(:campaign_encounter, quest: nil, campaign: campaign)).not_to be_valid

      encounter = build(:campaign_encounter, quest: create(:campaign_quest), campaign: campaign)
      expect(encounter).not_to be_valid
      expect(encounter.errors[:quest]).to include('must belong to the same campaign')
    end

    it 'allows positions from 0 to 9999' do
      [0, 9999].each do |position|
        encounter.position = position
        expect(encounter).to be_valid
      end
      [-1, 10_000, 1.5].each do |position|
        encounter.position = position
        expect(encounter).not_to be_valid, "expected #{position.inspect} to be rejected"
      end
    end

    it 'allows XP from 0 to a million, or none' do
      [nil, 0, CampaignQuest::MAX_XP].each do |xp|
        encounter.reward_xp = xp
        expect(encounter).to be_valid
      end
      [-1, CampaignQuest::MAX_XP + 1].each do |xp|
        encounter.reward_xp = xp
        expect(encounter).not_to be_valid
      end
    end

    it 'takes maps and coins like a quest' do
      encounter.assign_attributes(foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass', img: 'x.webp' }],
                                  reward_currency: { gp: '50' })

      expect(encounter).to be_valid
      expect(encounter).to have_attributes(foundry_scenes: [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }],
                                           reward_currency: { 'gp' => 50 })

      encounter.assign_attributes(foundry_scenes: [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Pass' }], reward_currency: { gp: -1 })
      expect(encounter).not_to be_valid
      expect(encounter.errors.attribute_names).to contain_exactly(:foundry_scenes, :reward_currency)
    end
  end

  describe 'links' do
    let(:encounter) { create(:campaign_encounter, quest: quest) }

    it 'are ordered by position' do
      later = create(:campaign_encounter_link, encounter: encounter, position: 2)
      sooner = create(:campaign_encounter_link, encounter: encounter, position: 1)

      expect(encounter.reload.links).to eq([sooner, later])
    end

    it 'are deleted with the encounter, leaving a tombstone only for the encounter' do
      create(:campaign_encounter_link, encounter: encounter)

      expect { encounter.destroy! }.to change(CampaignTombstone, :count).by(1)
      expect(CampaignTombstone.last).to have_attributes(campaign: campaign, record_type: 'CampaignEncounter',
                                                        record_uuid: encounter.uuid)
      expect(CampaignEncounterLink.count).to eq(0)
    end
  end

  describe 'sync' do
    it "is versioned by its campaign's counter" do
      encounter = create(:campaign_encounter, quest: quest)

      expect(encounter.sync_version).to eq(campaign.reload.sync_counter)
    end

    it 'leaves a tombstone when deleted with its quest, but not with its campaign' do
      encounter = create(:campaign_encounter, quest: quest)

      quest.destroy!
      expect(CampaignTombstone.where(record_type: 'CampaignEncounter').pluck(:record_uuid)).to eq([encounter.uuid])

      create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))
      expect { campaign.destroy! }.not_to raise_error
      expect(described_class.count).to eq(0)
    end

    it 'goes with its quest rather than losing it (its quest is its owner, not an optional pointer)' do
      encounter = create(:campaign_encounter, quest: quest)

      expect { quest.destroy! }.to change(described_class, :count).by(-1)
      expect(described_class.exists?(encounter.id)).to be false
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the encounter with its links' do
      encounter = create(:campaign_encounter, quest: quest, name: 'Ambush', kind: 'social', description: 'At the gate',
                                              notes: 'Hidden archers', position: 2, reward_xp: 450, reward_currency: { gp: 5 },
                                              foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])
      ghoul = create(:monster, user: nil, name: 'Ghoul', challenge_rating: '1')
      link = create(:campaign_encounter_link, encounter: encounter, linkable: ghoul, quantity: 4)

      expect(encounter.reload.as_json_for_api).to eq(
        id: encounter.id.to_s, uuid: encounter.uuid, questId: quest.id.to_s, name: 'Ambush', kind: 'social',
        description: 'At the gate', notes: 'Hidden archers', position: 2,
        foundryScenes: [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }], rewardCurrency: { 'gp' => 5 },
        rewardXp: 450,
        links: [{ id: link.id.to_s, uuid: link.uuid, linkableType: 'Monster', linkableId: ghoul.id.to_s, name: 'Ghoul',
                  slug: ghoul.slug, detail: 'CR 1', challengeRating: '1', position: 0, quantity: 4 }]
      )
    end

    it 'leaves out links whose record is gone' do
      encounter = create(:campaign_encounter, quest: quest)
      create(:campaign_encounter_link, encounter: encounter)
      CampaignEncounterLink.update_all(linkable_id: 0)

      expect(encounter.reload.as_json_for_api[:links]).to eq([])
    end
  end
end
