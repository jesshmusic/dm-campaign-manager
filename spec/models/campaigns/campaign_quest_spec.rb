require 'rails_helper'

RSpec.describe CampaignQuest, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_quest, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:kind).in_array(CampaignQuest::KINDS) }
    it { is_expected.to validate_inclusion_of(:status).in_array(CampaignQuest::STATUSES) }

    it 'defaults to an available main quest' do
      expect(described_class.new).to have_attributes(kind: 'main', status: 'available', position: 0)
    end

    it 'allows acts from 1 to 20 or none' do
      [nil, 1, 20].each do |act|
        subject.act = act
        expect(subject).to be_valid
      end
      [0, 21].each do |act|
        subject.act = act
        expect(subject).not_to be_valid
      end
    end

    it 'allows levels from 1 to 20' do
      subject.assign_attributes(level_min: 1, level_max: 20)
      expect(subject).to be_valid

      subject.assign_attributes(level_min: 0, level_max: nil)
      expect(subject).not_to be_valid

      subject.assign_attributes(level_min: nil, level_max: 21)
      expect(subject).not_to be_valid
    end

    it 'rejects a maximum level below the minimum' do
      subject.assign_attributes(level_min: 5, level_max: 3)

      expect(subject).not_to be_valid
      expect(subject.errors[:level_max]).to include("can't be lower than the minimum level")
    end
  end

  describe 'links' do
    it 'can nest under a quest and use an NPC and location from the same campaign' do
      quest = build(:campaign_quest, campaign: campaign,
                                     parent: create(:campaign_quest, campaign: campaign),
                                     giver_npc: create(:campaign_npc, campaign: campaign),
                                     location: create(:campaign_location, campaign: campaign))

      expect(quest).to be_valid
    end

    it 'rejects a parent, giver or location from another campaign' do
      quest = build(:campaign_quest, campaign: campaign, parent: create(:campaign_quest),
                                     giver_npc: create(:campaign_npc), location: create(:campaign_location))

      expect(quest).not_to be_valid
      %i[parent giver_npc location].each do |association|
        expect(quest.errors[association]).to include('must belong to the same campaign')
      end
    end

    it 'rejects a giver that does not exist' do
      quest = build(:campaign_quest, campaign: campaign, giver_npc_id: 0)

      expect(quest).not_to be_valid
      expect(quest.errors[:giver_npc]).to include('must exist')
    end

    it 'cannot be its own parent' do
      quest = create(:campaign_quest, campaign: campaign)
      quest.parent = quest

      expect(quest).not_to be_valid
      expect(quest.errors[:parent]).to include("can't be this quest or one of its sub-quests")
    end

    it 'cannot be nested inside its own sub-quest' do
      quest = create(:campaign_quest, campaign: campaign)
      sub_quest = create(:campaign_quest, campaign: campaign, parent: quest)
      quest.parent = sub_quest

      expect(quest).not_to be_valid
      expect(quest.errors[:parent]).to include("can't be this quest or one of its sub-quests")
    end

    it 'keeps sub-quests (unnested) when the parent is destroyed' do
      parent = create(:campaign_quest, campaign: campaign)
      child = create(:campaign_quest, campaign: campaign, parent: parent)

      parent.destroy!

      expect(child.reload.parent_id).to be_nil
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the quest' do
      npc = create(:campaign_npc, campaign: campaign)
      location = create(:campaign_location, campaign: campaign)
      quest = create(:campaign_quest, campaign: campaign, name: 'Lost Mine', kind: 'side', status: 'active', act: 2,
                                      position: 3, level_min: 2, level_max: 4, giver_npc: npc, location: location,
                                      reward: '500 gp')

      expect(quest.as_json_for_api).to eq(
        id: quest.id.to_s, uuid: quest.uuid, name: 'Lost Mine', kind: 'side', status: 'active', description: nil,
        reward: '500 gp', notes: nil, act: 2, position: 3, levelMin: 2, levelMax: 4, parentId: nil,
        giverNpcId: npc.id.to_s, locationId: location.id.to_s
      )
    end
  end
end
