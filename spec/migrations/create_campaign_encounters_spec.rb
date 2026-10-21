require 'rails_helper'
require Rails.root.join('db/migrate/20261021120000_create_campaign_encounters.rb')

# A quest's monsters move into one encounter per quest, and back again on rollback
RSpec.describe CreateCampaignEncounters do
  let(:campaign) { create(:campaign) }
  let(:quest) { create(:campaign_quest, campaign: campaign, name: 'Find the crypt') }
  let(:zombie) { create(:monster, user: nil, name: 'Zombie') }
  let(:ghoul) { create(:monster, user: nil, name: 'Ghoul') }
  let(:fanatic) { create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', category: 'monster') }
  let(:potion) { create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item') }
  let(:npc) { create(:campaign_npc, campaign: campaign, name: 'Sildar') }

  def migrate(step)
    ActiveRecord::Migration.suppress_messages { described_class.new.public_send(step) }
  end

  # Quest links as they were before quests lost their monsters (the app no longer makes these)
  def quest_link(linkable, position, quantity = nil)
    CampaignQuestLink.new(quest: quest, linkable: linkable, position: position, quantity: quantity).tap { |link| link.save!(validate: false) }
  end

  describe 'moving monsters into encounters' do
    let!(:links) do
      [quest_link(npc, 0), quest_link(zombie, 1, 6), quest_link(potion, 2, 2), quest_link(fanatic, 3), quest_link(ghoul, 4, 2)]
    end

    it "makes one fight per quest with its monsters, in order, with their counts" do
      migrate(:move_monsters_into_encounters)

      encounter = quest.encounters.sole
      expect(encounter).to have_attributes(campaign: campaign, name: 'Encounter', kind: 'combat', position: 0)
      expect(encounter.links.map { |link| [link.linkable, link.quantity, link.position] })
        .to eq([[zombie, 6, 0], [fanatic, nil, 1], [ghoul, 2, 2]])
      expect(encounter.links.map(&:uuid)).to all(be_present)
    end

    it 'takes them off the quest, leaving its NPCs and reward items' do
      migrate(:move_monsters_into_encounters)

      expect(quest.links.reload.map(&:linkable)).to eq([npc, potion])
    end

    it 'leaves a tombstone for each quest link it removes' do
      migrate(:move_monsters_into_encounters)

      removed = links.values_at(1, 3, 4).map(&:uuid)
      expect(CampaignTombstone.where(record_type: 'CampaignQuestLink').pluck(:record_uuid)).to match_array(removed)
    end

    it 'gives the quest and its encounter new sync versions, so a Foundry pull carries them' do
      cursor = CampaignSync.new(campaign).changes_since(0)[:cursor]

      migrate(:move_monsters_into_encounters)

      pulled = CampaignSync.new(campaign).changes_since(cursor)
      expect(pulled[:records]['quests'].sole).to include(uuid: quest.uuid, links: [include(name: 'Sildar'), include(name: 'Potion of Healing')])
      expect(pulled[:records]['encounters'].sole).to include(questId: quest.id.to_s, name: 'Encounter')
      expect(pulled[:tombstones].pluck(:type).uniq).to eq(['CampaignQuestLink'])
      expect(campaign.reload.sync_counter).to eq(quest.reload.sync_version + 1)
    end

    it 'leaves quests without monsters, and other campaigns, alone' do
      quiet = create(:campaign_quest, campaign: campaign)
      quiet.links.create!(linkable: npc)
      elsewhere = create(:campaign_quest)
      version = quiet.reload.sync_version

      migrate(:move_monsters_into_encounters)

      expect(quiet.reload.sync_version).to eq(version)
      expect([quiet.encounters, elsewhere.encounters]).to all(be_empty)
    end
  end

  describe 'rolling back' do
    it "puts every encounter's monsters back on its quest after its links, adding up a monster's counts" do
      quest.links.create!(linkable: npc)
      ambush = create(:campaign_encounter, quest: quest, position: 0)
      lair = create(:campaign_encounter, quest: quest, position: 1)
      ambush.links.create!(linkable: zombie, quantity: 3)
      ambush.links.create!(linkable: potion, quantity: 2)
      lair.links.create!(linkable: fanatic)
      lair.links.create!(linkable: zombie)

      migrate(:move_monsters_back_to_quests)

      expect(quest.links.reload.map { |link| [link.linkable, link.quantity, link.position] })
        .to eq([[npc, nil, 0], [zombie, 4, 1], [fanatic, nil, 2]])
      expect(CampaignEncounter.count).to eq(0)
      expect(CampaignEncounterLink.count).to eq(0)
      expect(CampaignTombstone.where(record_type: 'CampaignEncounter').pluck(:record_uuid)).to contain_exactly(ambush.uuid, lair.uuid)
    end

    it 'round-trips a quest with monsters' do
      quest_link(npc, 0)
      quest_link(zombie, 1, 6)
      quest_link(fanatic, 2)

      migrate(:move_monsters_into_encounters)
      migrate(:move_monsters_back_to_quests)

      expect(quest.links.reload.map { |link| [link.linkable, link.quantity] }).to eq([[npc, nil], [zombie, 6], [fanatic, nil]])
    end
  end
end
