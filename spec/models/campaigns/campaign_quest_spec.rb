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

  describe 'Foundry scenes' do
    subject(:quest) { build(:campaign_quest, campaign: campaign) }

    def scene(index, name: "Scene #{index}")
      { uuid: "Scene.#{index.to_s.rjust(16, 'a')}", name: name }
    end

    it 'has none by default' do
      expect(described_class.new.foundry_scenes).to eq([])
    end

    it 'accepts up to 20 scenes, each with a scene UUID and a name, keeping only those' do
      quest.foundry_scenes = [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass', img: 'pass.webp' }]
      expect(quest).to be_valid
      expect(quest.foundry_scenes).to eq([{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }])

      quest.foundry_scenes = Array.new(CampaignQuest::MAX_FOUNDRY_SCENES) { |i| scene(i) }
      expect(quest).to be_valid

      quest.foundry_scenes = Array.new(CampaignQuest::MAX_FOUNDRY_SCENES + 1) { |i| scene(i) }
      expect(quest).not_to be_valid
      expect(quest.errors[:foundry_scenes]).to include(
        'must be up to 20 Foundry scenes, each with a scene UUID and a name of up to 120 characters'
      )
    end

    it 'takes scenes from request parameters' do
      params = ActionController::Parameters.new(scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])
      quest.foundry_scenes = params.permit(scenes: %i[uuid name])[:scenes]

      expect(quest).to be_valid
      expect(quest.foundry_scenes).to eq([{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }])
    end

    it 'rejects scenes that are not world scenes with a name' do
      [[{ name: 'Mountain Pass' }], [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Pass' }], [scene(1, name: '')],
       [scene(1, name: 'x' * 121)], 'Mountain Pass', [['Scene.5wVcsNPOg2RjRbFx']]].each do |value|
        quest.foundry_scenes = value

        expect(quest).not_to be_valid, "expected #{value.inspect} to be rejected"
      end
    end

    it 'treats no scenes as an empty list' do
      quest.foundry_scenes = nil

      expect(quest.foundry_scenes).to eq([])
      expect(quest).to be_valid
    end
  end

  describe 'reward' do
    subject(:quest) { build(:campaign_quest, campaign: campaign) }

    let(:coins_message) { 'must be whole numbers of pp, gp, ep, sp and cp, up to 1,000,000 each' }

    it 'has no coins, XP or milestone by default' do
      expect(described_class.new).to have_attributes(reward_currency: {}, reward_xp: nil, milestone: false)
    end

    it 'accepts each kind of coin, from none up to a million, turning whole numbers sent as text into numbers' do
      quest.reward_currency = { pp: 0, gp: '50', ep: 1, sp: 12, cp: CampaignQuest::MAX_COINS }

      expect(quest).to be_valid
      expect(quest.reward_currency).to eq('pp' => 0, 'gp' => 50, 'ep' => 1, 'sp' => 12, 'cp' => 1_000_000)
    end

    it 'rejects other coins, and counts that are not whole numbers in range' do
      [{ zz: 5 }, { gp: -1 }, { gp: CampaignQuest::MAX_COINS + 1 }, { gp: 1.5 }, { gp: 'lots' }, { gp: nil },
       [['gp', 5]]].each do |coins|
        quest.reward_currency = coins

        expect(quest).not_to be_valid, "expected #{coins.inspect} to be rejected"
        expect(quest.errors[:reward_currency]).to include(coins_message)
      end
    end

    it 'treats no coins as none' do
      quest.reward_currency = nil

      expect(quest.reward_currency).to eq({})
      expect(quest).to be_valid
    end

    it 'allows XP from 0 to a million, or none' do
      [nil, 0, 450, CampaignQuest::MAX_XP].each do |xp|
        quest.reward_xp = xp
        expect(quest).to be_valid, "expected #{xp.inspect} to be allowed"
      end
      [-1, CampaignQuest::MAX_XP + 1, 1.5, 'lots'].each do |xp|
        quest.reward_xp = xp
        expect(quest).not_to be_valid, "expected #{xp.inspect} to be rejected"
      end
    end

    it 'can level the party up when done, as well as or instead of XP' do
      quest.assign_attributes(milestone: true, reward_xp: 200)
      expect(quest).to be_valid

      quest.milestone = nil
      expect(quest).not_to be_valid
      expect(quest.errors[:milestone]).to include('must be true or false')
    end
  end

  describe 'quest links' do
    let(:quest) { create(:campaign_quest, campaign: campaign) }

    it 'are ordered by position' do
      later = create(:campaign_quest_link, quest: quest, position: 2)
      sooner = create(:campaign_quest_link, quest: quest, position: 1)

      expect(quest.reload.links).to eq([sooner, later])
    end

    it 'are deleted with the quest, leaving a tombstone only for the quest' do
      create(:campaign_quest_link, quest: quest)

      expect { quest.destroy! }.to change(CampaignTombstone, :count).by(1)
      expect(CampaignTombstone.last.record_type).to eq('CampaignQuest')
      expect(CampaignQuestLink.count).to eq(0)
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
        giverNpcId: npc.id.to_s, locationId: location.id.to_s, foundryScenes: [], rewardCurrency: {}, rewardXp: nil,
        milestone: false, links: []
      )
    end

    it 'includes the maps, reward and links' do
      quest = create(:campaign_quest, campaign: campaign, reward_currency: { gp: 50, sp: 12 }, reward_xp: 450, milestone: true,
                                      foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])
      npc = create(:campaign_npc, campaign: campaign, name: 'Sildar')
      potion = create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', book: 'dmg', category: 'magic_item',
                                          page: 188)
      npc_link = create(:campaign_quest_link, quest: quest, linkable: npc)
      potion_link = create(:campaign_quest_link, quest: quest, linkable: potion, quantity: 3, position: 1)

      expect(quest.reload.as_json_for_api).to include(
        foundryScenes: [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }],
        rewardCurrency: { 'gp' => 50, 'sp' => 12 }, rewardXp: 450, milestone: true,
        links: [
          { id: npc_link.id.to_s, uuid: npc_link.uuid, linkableType: 'CampaignNpc', linkableId: npc.id.to_s, name: 'Sildar',
            slug: nil, detail: nil, position: 0, quantity: nil },
          { id: potion_link.id.to_s, uuid: potion_link.uuid, linkableType: 'CampaignReference', linkableId: potion.id.to_s,
            name: 'Potion of Healing', slug: nil, detail: "Dungeon Master's Guide p. 188", position: 1, quantity: 3 }
        ]
      )
    end

    it 'leaves out links whose record is gone' do
      quest = create(:campaign_quest, campaign: campaign)
      kept = create(:campaign_npc, campaign: campaign, name: 'Kept')
      create(:campaign_quest_link, quest: quest, linkable: kept)
      create(:campaign_quest_link, quest: quest, linkable: create(:monster, user: nil))
      CampaignQuestLink.where(linkable_type: 'Monster').update_all(linkable_id: 0)

      expect(quest.reload.as_json_for_api[:links].pluck(:name)).to eq(['Kept'])
    end
  end
end
