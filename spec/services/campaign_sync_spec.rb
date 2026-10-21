require 'rails_helper'

RSpec.describe CampaignSync do
  let(:campaign) { create(:campaign) }
  let(:sync) { described_class.new(campaign) }

  describe '#changes_since' do
    it 'returns the whole campaign on a first pull' do
      npc = create(:campaign_npc, campaign: campaign, name: 'Vex')
      create(:campaign_session, campaign: campaign)

      result = sync.changes_since(0)

      expect(result[:full]).to be true
      expect(result[:campaign]).to include(uuid: campaign.uuid, name: campaign.name)
      expect(result[:records]['npcs']).to contain_exactly(include(uuid: npc.uuid, name: 'Vex', syncVersion: npc.sync_version))
      expect(result[:records]['sessions'].size).to eq(1)
      expect(result[:records].keys).to match_array(described_class::COLLECTIONS.keys)
      expect(result[:cursor]).to eq(campaign.reload.sync_counter)
    end

    it 'returns only what changed since the cursor' do
      old_npc = create(:campaign_npc, campaign: campaign)
      cursor = sync.changes_since(0)[:cursor]
      new_npc = create(:campaign_npc, campaign: campaign)
      old_quest = create(:campaign_quest, campaign: campaign)

      result = sync.changes_since(cursor)

      expect(result[:full]).to be false
      expect(result[:records]['npcs'].pluck(:uuid)).to eq([new_npc.uuid])
      expect(result[:records]['npcs'].pluck(:uuid)).not_to include(old_npc.uuid)
      expect(result[:records]['quests'].pluck(:uuid)).to eq([old_quest.uuid])
    end

    it 'leaves out the campaign itself unless it changed' do
      create(:campaign_npc, campaign: campaign)
      cursor = sync.changes_since(0)[:cursor]
      create(:campaign_npc, campaign: campaign)

      expect(sync.changes_since(cursor)[:campaign]).to be_nil

      campaign.update!(pitch: 'New pitch')
      expect(sync.changes_since(cursor)[:campaign]).to include(pitch: 'New pitch')
    end

    it 'reports deletions as tombstones' do
      npc = create(:campaign_npc, campaign: campaign)
      cursor = sync.changes_since(0)[:cursor]
      npc.destroy!

      expect(sync.changes_since(cursor)[:tombstones]).to contain_exactly(
        include(type: 'CampaignNpc', uuid: npc.uuid)
      )
    end

    it 'includes a session again when its links change' do
      session = create(:campaign_session, campaign: campaign)
      secret = create(:campaign_secret, campaign: campaign)
      cursor = sync.changes_since(0)[:cursor]

      link = session.links.create!(linkable: secret)
      after_add = sync.changes_since(cursor)
      expect(after_add[:records]['sessions']).to contain_exactly(include(uuid: session.uuid))

      link.destroy!
      after_remove = sync.changes_since(after_add[:cursor])
      expect(after_remove[:records]['sessions'].first[:links]).to eq([])
    end

    it 'includes what was picked in Foundry, and the treasure' do
      location = create(:campaign_location, campaign: campaign, foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx',
                                            foundry_scene_name: 'Mountain Pass')
      npc = create(:campaign_npc, campaign: campaign, foundry_actor_uuid: 'Actor.Kz8rTq2LmN4pQw7X', foundry_actor_name: 'Cult Fanatic')
      session = create(:campaign_session, campaign: campaign, treasure_currency: { gp: 50 },
                                          foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])
      potion = create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item')
      session.links.create!(linkable: potion, quantity: 2)

      records = sync.changes_since(0)[:records]

      expect(records['locations'].sole).to include(uuid: location.uuid, foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
                                                   foundrySceneName: 'Mountain Pass')
      expect(records['npcs'].sole).to include(uuid: npc.uuid, foundryActorUuid: 'Actor.Kz8rTq2LmN4pQw7X',
                                              foundryActorName: 'Cult Fanatic')
      expect(records['sessions'].sole).to include(
        uuid: session.uuid, treasureCurrency: { 'gp' => 50 },
        foundryScenes: [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }],
        links: [include(name: 'Potion of Healing', quantity: 2)]
      )
    end

    it "includes a quest's maps, reward and links, and the quest again when its links change" do
      quest = create(:campaign_quest, campaign: campaign, reward_currency: { gp: 50 }, reward_xp: 300, milestone: true,
                                      foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }])
      sildar = create(:campaign_npc, campaign: campaign, name: 'Sildar')
      quest.links.create!(linkable: sildar)
      potion = quest.links.create!(linkable: create(:campaign_reference, campaign: campaign, name: 'Potion', category: 'magic_item'),
                                   quantity: 2, position: 1)

      first = sync.changes_since(0)
      expect(first[:records]['quests'].sole).to include(
        uuid: quest.uuid, rewardCurrency: { 'gp' => 50 }, rewardXp: 300, milestone: true,
        foundryScenes: [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }],
        links: [include(linkableType: 'CampaignNpc', name: 'Sildar'), include(name: 'Potion', quantity: 2)]
      )

      potion.update!(quantity: 3)
      after_change = sync.changes_since(first[:cursor])
      expect(after_change[:records]['quests']).to contain_exactly(include(uuid: quest.uuid, links: [anything, include(quantity: 3)]))

      sildar.destroy!
      after_delete = sync.changes_since(after_change[:cursor])
      expect(after_delete[:records]['quests'].sole[:links].pluck(:name)).to eq(['Potion'])
    end

    it 'includes a session again when a treasure quantity changes' do
      session = create(:campaign_session, campaign: campaign)
      link = session.links.create!(linkable: create(:campaign_reference, campaign: campaign, category: 'magic_item'))
      cursor = sync.changes_since(0)[:cursor]

      link.update!(quantity: 5)

      expect(sync.changes_since(cursor)[:records]['sessions']).to contain_exactly(
        include(uuid: session.uuid, links: [include(quantity: 5)])
      )
    end

    it "never includes another campaign's records" do
      create(:campaign_npc, campaign: create(:campaign))

      expect(sync.changes_since(0)[:records]['npcs']).to eq([])
    end
  end

  describe '#apply' do
    let(:front) { create(:campaign_front, campaign: campaign, clock_segments: 6, clock_filled: 1) }

    it 'applies a change based on the current version' do
      result = sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                             attributes: { clockFilled: 3 } }])

      expect(result[:applied]).to contain_exactly(include(type: 'front', uuid: front.uuid))
      expect(front.reload.clock_filled).to eq(3)
      expect(result[:cursor]).to eq(campaign.reload.sync_counter)
    end

    it 'returns a conflict when the record changed since the base version' do
      base = front.sync_version
      front.update!(clock_filled: 2)

      result = sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: base, attributes: { clockFilled: 4 } }])

      expect(result[:conflicts]).to contain_exactly(include(uuid: front.uuid, current: include(clockFilled: 2)))
      expect(front.reload.clock_filled).to eq(2)
    end

    it 'reveals a secret in a session' do
      secret = create(:campaign_secret, campaign: campaign)
      session = create(:campaign_session, campaign: campaign)

      sync.apply([{ type: 'secret', uuid: secret.uuid, baseVersion: secret.sync_version,
                    attributes: { revealed: true, revealedSessionUuid: session.uuid } }])

      expect(secret.reload).to be_revealed
      expect(secret.revealed_session).to eq(session)
    end

    it 'updates quest status and the session log' do
      quest = create(:campaign_quest, campaign: campaign)
      session = create(:campaign_session, campaign: campaign)

      sync.apply([
                   { type: 'quest', uuid: quest.uuid, baseVersion: quest.sync_version, attributes: { status: 'completed' } },
                   { type: 'session', uuid: session.uuid, baseVersion: session.sync_version,
                     attributes: { log: 'The party fled.', status: 'played' } }
                 ])

      expect(quest.reload.status).to eq('completed')
      expect(session.reload).to have_attributes(log: 'The party fled.', status: 'played')
    end

    it "rejects attributes the record type doesn't have, saving nothing" do
      result = sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                             attributes: { clockFilled: 2, id: front.id.to_s, syncVersion: 9 } }])

      expect(result[:errors]).to contain_exactly(include(uuid: front.uuid, errors: ["Can't set id, syncVersion on a front"]))
      expect(front.reload.clock_filled).to eq(1)
    end

    it 'reports validation errors' do
      result = sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                             attributes: { clockFilled: 99 } }])

      expect(result[:errors]).to contain_exactly(include(uuid: front.uuid))
      expect(front.reload.clock_filled).to eq(1)
    end

    it 'rejects record types Foundry may not change' do
      link = create(:campaign_session_link, session: create(:campaign_session, campaign: campaign))

      result = sync.apply([{ type: 'sessionLink', uuid: link.uuid, baseVersion: link.sync_version,
                             attributes: { quantity: 2 } }])

      expect(result[:errors]).to contain_exactly(include(uuid: link.uuid, errors: ["Can't change \"sessionLink\" records from Foundry"]))
      expect(link.reload.quantity).to be_nil
    end

    describe "a place's Foundry scene" do
      let(:location) { create(:campaign_location, campaign: campaign, name: 'Mountain Pass') }

      def push(attributes, base: location.sync_version)
        sync.apply([{ type: 'location', uuid: location.uuid, baseVersion: base, attributes: attributes }])
      end

      it 'links the scene picked in Foundry' do
        result = push({ foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', foundrySceneName: 'The Pass' })

        expect(result[:applied]).to contain_exactly(
          include(type: 'location', uuid: location.uuid,
                  current: include(foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', foundrySceneName: 'The Pass'))
        )
        expect(location.reload).to have_attributes(foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx', foundry_scene_name: 'The Pass')
      end

      it 'unlinks the scene' do
        location.update!(foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx', foundry_scene_name: 'The Pass')

        result = push({ foundrySceneUuid: nil, foundrySceneName: nil })

        expect(result[:applied].size).to eq(1)
        expect(location.reload).to have_attributes(foundry_scene_uuid: nil, foundry_scene_name: nil)
      end

      it 'returns a conflict when the place changed since the base version' do
        base = location.sync_version
        location.update!(foundry_scene_uuid: 'Scene.aaaaaaaaaaaaaaaa', foundry_scene_name: 'Old')

        result = push({ foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', foundrySceneName: 'New' }, base: base)

        expect(result[:conflicts]).to contain_exactly(
          include(type: 'location', uuid: location.uuid, current: include(foundrySceneUuid: 'Scene.aaaaaaaaaaaaaaaa'))
        )
        expect(location.reload.foundry_scene_name).to eq('Old')
      end

      it 'reports a UUID that is not a scene' do
        result = push({ foundrySceneUuid: 'Actor.5wVcsNPOg2RjRbFx', foundrySceneName: 'The Pass' })

        expect(result[:errors]).to contain_exactly(include(uuid: location.uuid, errors: ['Foundry scene uuid is invalid']))
        expect(location.reload.foundry_scene_uuid).to be_nil
      end

      it "changes the place's other fields with it" do
        push({ foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Renamed', description: 'Changed' })

        expect(location.reload).to have_attributes(foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Renamed',
                                                   description: 'Changed')
      end
    end

    describe "an NPC's Foundry actor" do
      let(:npc) { create(:campaign_npc, campaign: campaign, name: 'Brother Ash') }
      let(:actor_uuid) { 'Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000' }

      def push(attributes, base: npc.sync_version)
        sync.apply([{ type: 'npc', uuid: npc.uuid, baseVersion: base, attributes: attributes }])
      end

      it 'links the actor picked in Foundry' do
        result = push({ foundryActorUuid: actor_uuid, foundryActorName: 'Cult Fanatic' })

        expect(result[:applied]).to contain_exactly(
          include(type: 'npc', uuid: npc.uuid, current: include(foundryActorUuid: actor_uuid, foundryActorName: 'Cult Fanatic'))
        )
        expect(npc.reload).to have_attributes(foundry_actor_uuid: actor_uuid, foundry_actor_name: 'Cult Fanatic')
      end

      it 'returns a conflict when the NPC changed since the base version' do
        base = npc.sync_version
        npc.update!(motive: 'Revenge')

        result = push({ foundryActorUuid: actor_uuid }, base: base)

        expect(result[:conflicts]).to contain_exactly(include(type: 'npc', uuid: npc.uuid, current: include(motive: 'Revenge')))
        expect(npc.reload.foundry_actor_uuid).to be_nil
      end

      it 'reports a UUID that is not an actor' do
        result = push({ foundryActorUuid: 'Compendium.dnd5e.items.Item.Kz8rTq2LmN4pQw7X', foundryActorName: 'Cult Fanatic' })

        expect(result[:errors]).to contain_exactly(include(uuid: npc.uuid, errors: ['Foundry actor uuid is invalid']))
        expect(npc.reload.foundry_actor_uuid).to be_nil
      end

      it "changes the NPC's other fields with it" do
        push({ foundryActorUuid: actor_uuid, name: 'Renamed', role: 'bbeg', secret: 'Changed' })

        expect(npc.reload).to have_attributes(foundry_actor_uuid: actor_uuid, name: 'Renamed', role: 'bbeg', secret: 'Changed')
      end
    end

    describe "a quest's maps and reward" do
      let(:quest) { create(:campaign_quest, campaign: campaign, reward_currency: { gp: 5 }) }
      let(:scenes) { [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }] }

      def push(attributes, base: quest.sync_version)
        sync.apply([{ type: 'quest', uuid: quest.uuid, baseVersion: base, attributes: attributes }])
      end

      it 'saves the scenes, coins, XP and milestone picked in Foundry' do
        result = push({ foundryScenes: scenes, rewardCurrency: { gp: 50, sp: 12 }, rewardXp: 450, milestone: true, status: 'active' })

        expect(result[:applied]).to contain_exactly(
          include(type: 'quest', uuid: quest.uuid,
                  current: include(rewardCurrency: { 'gp' => 50, 'sp' => 12 }, foundryScenes: scenes.map(&:stringify_keys),
                                   rewardXp: 450, milestone: true, status: 'active', links: []))
        )
        expect(quest.reload).to have_attributes(reward_currency: { 'gp' => 50, 'sp' => 12 }, foundry_scenes: scenes.map(&:stringify_keys),
                                                reward_xp: 450, milestone: true, status: 'active')
      end

      it 'clears the XP and coins' do
        quest.update!(reward_xp: 100)

        push({ rewardXp: nil, rewardCurrency: {} })

        expect(quest.reload).to have_attributes(reward_xp: nil, reward_currency: {})
      end

      it 'returns a conflict when the quest changed since the base version' do
        base = quest.sync_version
        quest.update!(reward_xp: 100)

        result = push({ rewardXp: 450 }, base: base)

        expect(result[:conflicts]).to contain_exactly(include(uuid: quest.uuid, current: include(rewardXp: 100)))
        expect(quest.reload.reward_xp).to eq(100)
      end

      it 'reports bad scenes, coins, XP and milestones' do
        result = push({ foundryScenes: [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Not a scene' }], rewardCurrency: { gp: -1 },
                        rewardXp: -5, milestone: nil })

        expect(result[:errors]).to contain_exactly(
          include(uuid: quest.uuid, errors: include(/Foundry scenes must be/, /Reward currency must be/, /Reward xp must be/,
                                                    /Milestone must be/))
        )
        expect(quest.reload).to have_attributes(foundry_scenes: [], reward_currency: { 'gp' => 5 }, reward_xp: nil, milestone: false)
      end

      it "changes the quest's other fields and its links with it" do
        sildar = create(:campaign_npc, campaign: campaign, name: 'Sildar')

        push({ name: 'Renamed', reward: 'Changed', links: [{ linkableType: 'CampaignNpc', linkableId: sildar.id.to_s }], rewardXp: 10 })

        expect(quest.reload).to have_attributes(name: 'Renamed', reward: 'Changed', reward_xp: 10)
        expect(quest.links.map(&:linkable)).to eq([sildar])
      end
    end

    describe "a quest's handouts" do
      let(:quest) { create(:campaign_quest, campaign: campaign) }
      let(:handouts) do
        [{ uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter' },
         { uuid: 'Compendium.world.lore.JournalEntry.5wVcsNPOg2RjRbFx.JournalEntryPage.abcdefghijklmnop', name: 'A map' }]
      end

      def push(attributes)
        sync.apply([{ type: 'quest', uuid: quest.uuid, baseVersion: quest.reload.sync_version, attributes: attributes }])
      end

      it 'saves the journal entries and pages dropped on the quest, in order' do
        result = push({ handouts: handouts })

        expect(result[:applied]).to contain_exactly(include(current: include(handouts: handouts.map(&:stringify_keys))))
        expect(quest.reload.handouts).to eq(handouts.map(&:stringify_keys))
      end

      it 'clears them' do
        quest.update!(handouts: handouts)

        push({ handouts: [] })

        expect(quest.reload.handouts).to eq([])
      end

      it "reports handouts that aren't journal entries or pages" do
        result = push({ handouts: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Not a journal' }] })

        expect(result[:errors]).to contain_exactly(include(uuid: quest.uuid, errors: [/Handouts must be up to 20 Foundry journal/]))
        expect(quest.reload.handouts).to eq([])
      end
    end

    describe "a place's roll tables" do
      let(:location) { create(:campaign_location, campaign: campaign) }
      let(:tables) { [{ uuid: 'RollTable.5wVcsNPOg2RjRbFx', name: 'Moathouse encounters' }] }

      def push(attributes)
        sync.apply([{ type: 'location', uuid: location.uuid, baseVersion: location.reload.sync_version, attributes: attributes }])
      end

      it 'saves the roll tables dropped on the place' do
        result = push({ rollTables: tables })

        expect(result[:applied]).to contain_exactly(include(current: include(rollTables: tables.map(&:stringify_keys))))
        expect(location.reload.roll_tables).to eq(tables.map(&:stringify_keys))
        expect(sync.changes_since(0)[:records]['locations']).to contain_exactly(include(rollTables: tables.map(&:stringify_keys)))
      end

      it "reports tables that aren't roll tables" do
        result = push({ rollTables: [{ uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'Not a table' }] })

        expect(result[:errors]).to contain_exactly(include(uuid: location.uuid, errors: [/Roll tables must be up to 10 Foundry roll/]))
      end
    end

    describe "a quest's encounters" do
      let(:quest) { create(:campaign_quest, campaign: campaign, name: 'Find the crypt') }
      let(:encounter) { create(:campaign_encounter, quest: quest, name: 'Ambush') }
      let(:scenes) { [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }] }

      def push(attributes, record: encounter, base: record.reload.sync_version)
        sync.apply([{ type: 'encounter', uuid: record.uuid, baseVersion: base, attributes: attributes }])
      end

      it 'pulls them on their own, with their quest id and links' do
        encounter.links.create!(linkable: create(:monster, user: nil, name: 'Ghoul'), quantity: 3)

        pulled = sync.changes_since(0)[:records]['encounters']

        expect(pulled).to contain_exactly(
          include(uuid: encounter.uuid, questId: quest.id.to_s, name: 'Ambush', kind: 'combat', position: 0,
                  foundryScenes: [], rewardCurrency: {}, rewardXp: nil, syncVersion: encounter.reload.sync_version,
                  links: [include(linkableType: 'Monster', name: 'Ghoul', quantity: 3)])
        )
      end

      it 'pulls an encounter again, and not its quest, when its links change' do
        encounter
        cursor = sync.changes_since(0)[:cursor]

        encounter.links.create!(linkable: create(:monster, user: nil))

        pulled = sync.changes_since(cursor)
        expect(pulled[:records]['encounters'].pluck(:uuid)).to eq([encounter.uuid])
        expect(pulled[:records]['quests']).to eq([])
      end

      it 'changes every field Foundry may set' do
        other_quest = create(:campaign_quest, campaign: campaign)

        result = push({ name: 'The lair', kind: 'puzzle', description: 'A riddle door', notes: 'Answer: echo', position: 2,
                        questId: other_quest.id.to_s, foundryScenes: scenes, rewardCurrency: { gp: 50 }, rewardXp: 450 })

        expect(result[:errors]).to eq([])
        expect(encounter.reload).to have_attributes(name: 'The lair', kind: 'puzzle', description: 'A riddle door',
                                                    notes: 'Answer: echo', position: 2, quest: other_quest,
                                                    foundry_scenes: scenes, reward_currency: { 'gp' => 50 }, reward_xp: 450)
        expect(result[:applied].sole[:current]).to include(questId: other_quest.id.to_s, kind: 'puzzle')
      end

      it "rejects a quest from another campaign, or none, and fields it doesn't have" do
        stranger = create(:campaign_quest)

        expect(push({ questId: stranger.id })[:errors].sole[:errors]).to include('Quest must belong to the same campaign')
        expect(push({ questId: nil })[:errors].sole[:errors]).to include('Quest must exist')
        expect(push({ questId: 'crypt' })[:errors].sole[:errors]).to eq(['Quest must be a record id'])
        expect(push({ status: 'active' })[:errors].sole[:errors]).to eq(["Can't set status on an encounter"])
        expect(push({ kind: 'brawl' })[:errors].sole[:errors]).to eq(['Kind is not included in the list'])
        expect(encounter.reload.quest).to eq(quest)
      end

      it 'returns a conflict when it changed since the base version' do
        base = encounter.sync_version
        encounter.update!(name: 'Changed on the website')

        result = push({ name: 'Changed in Foundry' }, base: base)

        expect(result[:conflicts]).to contain_exactly(include(type: 'encounter', current: include(name: 'Changed on the website')))
      end

      it 'creates one on a quest, with its links' do
        uuid = SecureRandom.uuid
        zombie = create(:monster, user: nil)

        result = sync.apply([{ op: 'create', type: 'encounter', uuid: uuid,
                               attributes: { name: 'Ambush', kind: 'combat', questId: quest.id,
                                             links: [{ linkableType: 'Monster', linkableId: zombie.id, quantity: 6 }] } }])

        created = CampaignEncounter.find_by!(uuid: uuid)
        expect(created).to have_attributes(campaign: campaign, quest: quest, name: 'Ambush')
        expect(created.links.sole).to have_attributes(linkable: zombie, quantity: 6)
        expect(result[:applied].sole).to include(type: 'encounter', uuid: uuid, current: include(questId: quest.id.to_s))
      end

      it "doesn't create one without a quest" do
        result = sync.apply([{ op: 'create', type: 'encounter', uuid: SecureRandom.uuid, attributes: { name: 'Ambush' } }])

        expect(result[:errors].sole[:errors]).to include('Quest must exist')
        expect(CampaignEncounter.count).to eq(0)
      end

      it 'deletes one, leaving a tombstone' do
        encounter
        cursor = sync.changes_since(0)[:cursor]

        result = sync.apply([{ op: 'delete', type: 'encounter', uuid: encounter.uuid }])

        expect(result[:deleted]).to eq([encounter.uuid])
        expect(sync.changes_since(cursor)[:tombstones]).to contain_exactly(include(type: 'CampaignEncounter', uuid: encounter.uuid))
      end
    end

    describe "a session's Foundry scenes and treasure coins" do
      let(:session) { create(:campaign_session, campaign: campaign, treasure_currency: { gp: 5 }) }
      let(:scenes) { [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }, { uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Cave' }] }

      def push(attributes, base: session.sync_version)
        sync.apply([{ type: 'session', uuid: session.uuid, baseVersion: base, attributes: attributes }])
      end

      it 'saves the scenes and coins picked in Foundry' do
        result = push({ foundryScenes: scenes, treasureCurrency: { gp: 50, sp: 12 } })

        expect(result[:applied]).to contain_exactly(
          include(type: 'session', uuid: session.uuid,
                  current: include(treasureCurrency: { 'gp' => 50, 'sp' => 12 }, foundryScenes: scenes.map(&:stringify_keys)))
        )
        expect(session.reload).to have_attributes(treasure_currency: { 'gp' => 50, 'sp' => 12 },
                                                  foundry_scenes: scenes.map(&:stringify_keys))
      end

      it 'returns a conflict when the session changed since the base version' do
        base = session.sync_version
        session.update!(treasure_currency: { gp: 7 })

        result = push({ treasureCurrency: { gp: 50 } }, base: base)

        expect(result[:conflicts]).to contain_exactly(include(uuid: session.uuid, current: include(treasureCurrency: { 'gp' => 7 })))
        expect(session.reload.treasure_currency).to eq('gp' => 7)
      end

      it 'reports scenes that are not Foundry scenes' do
        result = push({ foundryScenes: [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Not a scene' }] })

        expect(result[:errors]).to contain_exactly(include(uuid: session.uuid, errors: [/Foundry scenes must be/]))
        expect(session.reload.foundry_scenes).to eq([])
      end

      it 'reports coins that are not whole numbers of pp, gp, ep, sp and cp' do
        result = push({ treasureCurrency: { gp: -1, zz: 3 } })

        expect(result[:errors]).to contain_exactly(include(uuid: session.uuid, errors: [/Treasure currency must be/]))
        expect(session.reload.treasure_currency).to eq('gp' => 5)
      end

      it 'keeps the existing fields Foundry may change' do
        push({ log: 'The party took the pass.', foundryScenes: scenes })

        expect(session.reload).to have_attributes(log: 'The party took the pass.', treasure_currency: { 'gp' => 5 })
      end
    end

    it "can't change another campaign's records" do
      other_front = create(:campaign_front, campaign: create(:campaign))

      result = sync.apply([{ type: 'front', uuid: other_front.uuid, baseVersion: other_front.sync_version,
                             attributes: { clockFilled: 2 } }])

      expect(result[:errors]).to contain_exactly(include(errors: ['Record not found']))
      expect(other_front.reload.clock_filled).to eq(0)
    end

    it 'caps how many changes it takes at once' do
      changes = Array.new(described_class::MAX_CHANGES + 5) { { type: 'npc', uuid: 'x' } }

      expect(sync.apply(changes)[:errors].size).to eq(described_class::MAX_CHANGES)
    end

    describe 'updating any field' do
      def push(type, record, attributes, base: record.sync_version)
        sync.apply([{ type: type, uuid: record.uuid, baseVersion: base, attributes: attributes }])
      end

      it "changes the campaign's brief" do
        attributes = { name: 'The Grey Plague', premise: 'The dead rise', pitch: 'Survive the winter', settingName: 'Greyhawk',
                       settingNotes: 'The Flanaess', truths: [{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why.' }],
                       tone: 'Grim', partySize: 4, startLevel: 3,
                       targetLevel: 8, plannedSessions: 6, cadence: 'Weekly', status: 'active' }

        result = push('campaign', campaign, attributes)

        expect(result[:applied]).to contain_exactly(
          include(type: 'campaign', uuid: campaign.uuid, current: include(attributes.merge(syncVersion: campaign.reload.sync_version)))
        )
        expect(campaign).to have_attributes(
          name: 'The Grey Plague', premise: 'The dead rise', pitch: 'Survive the winter', setting_name: 'Greyhawk',
          setting_notes: 'The Flanaess', truths: [{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why.' }],
          tone: 'Grim', party_size: 4, start_level: 3, target_level: 8,
          planned_sessions: 6, cadence: 'Weekly', status: 'active'
        )
        expect(sync.changes_since(0)[:campaign]).to include(name: 'The Grey Plague', syncVersion: campaign.sync_version)
      end

      it "takes the campaign's truths as strings, as older versions of the module send them" do
        result = push('campaign', campaign, { truths: ['The dead walk. Nobody knows why.', { name: 'Gold rules' }, 'No end'] })

        expected = [{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why.' },
                    { 'name' => 'Gold rules', 'description' => '' }, { 'name' => 'No end', 'description' => '' }]
        expect(result[:applied]).to contain_exactly(include(current: include(truths: expected)))
        expect(campaign.reload.truths).to eq(expected)
      end

      it 'says why truths are rejected' do
        result = push('campaign', campaign, { truths: [{ name: '', description: 'No name' }] })

        expect(result[:errors]).to contain_exactly(include(uuid: campaign.uuid, errors: ['Each truth needs a name']))
        expect(campaign.reload.truths).to eq([])
      end

      it 'returns a conflict when the campaign changed since the base version' do
        base = campaign.sync_version
        campaign.update!(pitch: 'Changed on the website')

        result = push('campaign', campaign, { pitch: 'Changed in Foundry' }, base: base)

        expect(result[:conflicts]).to contain_exactly(
          include(type: 'campaign', uuid: campaign.uuid, current: include(pitch: 'Changed on the website'))
        )
        expect(campaign.reload.pitch).to eq('Changed on the website')
      end

      it "can't change another campaign" do
        other = create(:campaign, name: 'Not mine')

        result = push('campaign', other, { name: 'Mine now' })

        expect(result[:errors]).to contain_exactly(include(uuid: other.uuid, errors: ['Record not found']))
        expect(other.reload.name).to eq('Not mine')
      end

      it 'reports what is wrong with the campaign' do
        result = push('campaign', campaign, { startLevel: 5, targetLevel: 3 })

        expect(result[:errors]).to contain_exactly(
          include(uuid: campaign.uuid, errors: ["Target level can't be lower than the starting level"])
        )
        expect(campaign.reload.start_level).to be_nil
      end

      it 'changes a faction' do
        faction = create(:campaign_faction, campaign: campaign)

        result = push('faction', faction, { name: 'Cult of Nerull', goal: 'Raise the dead', description: 'Robed', notes: 'Hidden' })

        expect(result[:applied].sole).to include(
          type: 'faction', uuid: faction.uuid,
          current: include(name: 'Cult of Nerull', goal: 'Raise the dead', syncVersion: faction.reload.sync_version)
        )
        expect(faction).to have_attributes(name: 'Cult of Nerull', goal: 'Raise the dead', description: 'Robed', notes: 'Hidden')
      end

      it 'changes a place and its parent' do
        location = create(:campaign_location, campaign: campaign)
        city = create(:campaign_location, campaign: campaign, name: 'Greyhawk City')

        result = push('location', location, { name: 'The Crypt', description: 'Cold', features: ['Bones'], notes: 'Trapped',
                                               parentId: city.id.to_s, foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
                                               foundrySceneName: 'Crypt' })

        expect(result[:applied].sole[:current]).to include(name: 'The Crypt', features: ['Bones'], parentId: city.id.to_s)
        expect(location.reload).to have_attributes(name: 'The Crypt', description: 'Cold', features: ['Bones'], notes: 'Trapped',
                                                   parent: city, foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx',
                                                   foundry_scene_name: 'Crypt')
      end

      it 'changes an NPC, its faction and its book stat block' do
        npc = create(:campaign_npc, campaign: campaign)
        faction = create(:campaign_faction, campaign: campaign)
        reference = create(:campaign_reference, campaign: campaign)

        result = push('npc', npc, { name: 'Vex', role: 'bbeg', description: 'Pale', motive: 'Power', secret: 'Undead',
                                    appearance: 'Tall', voice: 'A whisper', notes: 'Lair below', factionId: faction.id,
                                    statBlockReferenceId: reference.id.to_s, foundryActorUuid: 'Actor.Kz8rTq2LmN4pQw7X',
                                    foundryActorName: 'Lich' })

        expect(result[:applied].sole[:current]).to include(name: 'Vex', factionId: faction.id.to_s,
                                                           statBlockReference: include(id: reference.id.to_s))
        expect(npc.reload).to have_attributes(
          name: 'Vex', role: 'bbeg', description: 'Pale', motive: 'Power', secret: 'Undead', appearance: 'Tall',
          voice: 'A whisper', notes: 'Lair below', faction: faction, stat_block_reference: reference,
          foundry_actor_uuid: 'Actor.Kz8rTq2LmN4pQw7X', foundry_actor_name: 'Lich'
        )
      end

      it 'clears pointers sent as null or empty' do
        npc = create(:campaign_npc, campaign: campaign, faction: create(:campaign_faction, campaign: campaign),
                                    stat_block_reference: create(:campaign_reference, campaign: campaign))

        result = push('npc', npc, { factionId: nil, statBlockReferenceId: '' })

        expect(result[:applied].sole[:current]).to include(factionId: nil, statBlockReference: nil)
        expect(npc.reload).to have_attributes(faction_id: nil, stat_block_reference_id: nil)
      end

      it 'changes a front, its portents, clock, NPC and faction' do
        threat = create(:campaign_front, campaign: campaign)
        npc = create(:campaign_npc, campaign: campaign)
        faction = create(:campaign_faction, campaign: campaign)

        push('front', threat, { name: 'The Plague', goal: 'Spread', doom: 'All dead', description: 'Rot',
                                portents: [{ text: 'Villages fall', triggered: true }, { text: 'Walls breached' }],
                                stakes: ['Will the city fall?'], clockSegments: 8, clockFilled: 3, npcId: npc.id.to_s,
                                factionId: faction.id.to_s })

        expect(threat.reload).to have_attributes(
          name: 'The Plague', goal: 'Spread', doom: 'All dead', description: 'Rot', stakes: ['Will the city fall?'],
          portents: [{ 'text' => 'Villages fall', 'triggered' => true }, { 'text' => 'Walls breached', 'triggered' => false }],
          clock_segments: 8, clock_filled: 3, npc: npc, faction: faction
        )
      end

      it 'changes a quest, its parent, giver and place' do
        quest = create(:campaign_quest, campaign: campaign)
        parent = create(:campaign_quest, campaign: campaign)
        npc = create(:campaign_npc, campaign: campaign)
        location = create(:campaign_location, campaign: campaign)
        scenes = [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Crypt' }]

        result = push('quest', quest, { name: 'Find the crypt', kind: 'side', status: 'active', act: 2, description: 'Below',
                                        reward: 'Thanks', notes: 'Hard', levelMin: 3, levelMax: 5, parentId: parent.id.to_s,
                                        giverNpcId: npc.id.to_s, locationId: location.id, foundryScenes: scenes,
                                        rewardCurrency: { gp: 50 }, rewardXp: 300, milestone: true })

        expect(result[:applied].sole[:current]).to include(name: 'Find the crypt', parentId: parent.id.to_s,
                                                           giverNpcId: npc.id.to_s, locationId: location.id.to_s)
        expect(quest.reload).to have_attributes(
          name: 'Find the crypt', kind: 'side', status: 'active', act: 2, description: 'Below', reward: 'Thanks', notes: 'Hard',
          level_min: 3, level_max: 5, parent: parent, giver_npc: npc, location: location, foundry_scenes: scenes,
          reward_currency: { 'gp' => 50 }, reward_xp: 300, milestone: true
        )
      end

      it 'changes a secret' do
        secret = create(:campaign_secret, campaign: campaign)
        session = create(:campaign_session, campaign: campaign)

        result = push('secret', secret, { text: 'The mayor is a ghoul', revelation: 'The mayor', revealed: true,
                                          revealedSessionUuid: session.uuid, position: 2 })

        expect(result[:applied].sole[:current]).to include(text: 'The mayor is a ghoul', revealed: true,
                                                           revealedSessionId: session.id.to_s)
        expect(secret.reload).to have_attributes(text: 'The mayor is a ghoul', revelation: 'The mayor', revealed?: true,
                                                 revealed_session: session, position: 2)
      end

      it 'changes a session' do
        session = create(:campaign_session, campaign: campaign)
        scenes = [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Gate' }]

        result = push('session', session, { title: 'Outbreak', scheduledOn: '2026-11-01', level: 3, status: 'prepped',
                                            characterNotes: 'Akra is hurt', strongStart: 'Zombies at the gate',
                                            scenes: ['The gate'], treasure: 'A ring', treasureCurrency: { gp: 10 },
                                            foundryScenes: scenes, log: 'They fled', recap: 'The party fled' })

        expect(result[:applied].sole[:current]).to include(title: 'Outbreak', scheduledOn: '2026-11-01', displayTitle: 'Outbreak')
        expect(session.reload).to have_attributes(
          title: 'Outbreak', scheduled_on: Date.new(2026, 11, 1), level: 3, status: 'prepped', character_notes: 'Akra is hurt',
          strong_start: 'Zombies at the gate', scenes: ['The gate'], treasure: 'A ring', treasure_currency: { 'gp' => 10 },
          foundry_scenes: scenes, log: 'They fled', recap: 'The party fled'
        )
      end

      it 'changes a book reference' do
        reference = create(:campaign_reference, campaign: campaign)
        actor = 'Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000'

        result = push('reference', reference, { name: 'Cult Fanatic', book: 'mm', category: 'monster', page: 92,
                                                challengeRating: '2', foundryUuid: actor, notes: 'The leader' })

        expect(result[:applied].sole[:current]).to include(name: 'Cult Fanatic', citation: 'Monster Manual p. 92')
        expect(reference.reload).to have_attributes(name: 'Cult Fanatic', book: 'mm', category: 'monster', page: 92,
                                                    challenge_rating: '2', foundry_uuid: actor, notes: 'The leader')
      end
    end

    describe "pointers to the campaign's other records" do
      let(:npc) { create(:campaign_npc, campaign: campaign) }

      def push(attributes)
        sync.apply([{ type: 'npc', uuid: npc.uuid, baseVersion: npc.sync_version, attributes: attributes }])
      end

      it "rejects another campaign's records" do
        result = push({ factionId: create(:campaign_faction).id.to_s, statBlockReferenceId: create(:campaign_reference).id })

        expect(result[:errors]).to contain_exactly(
          include(uuid: npc.uuid, errors: contain_exactly('Faction must belong to the same campaign',
                                                          'Stat block reference must belong to the same campaign'))
        )
        expect(npc.reload).to have_attributes(faction_id: nil, stat_block_reference_id: nil)
      end

      it "rejects another campaign's records as a quest's parent, giver and place" do
        quest = create(:campaign_quest, campaign: campaign)

        result = sync.apply([{ type: 'quest', uuid: quest.uuid, baseVersion: quest.sync_version,
                               attributes: { parentId: create(:campaign_quest).id, giverNpcId: create(:campaign_npc).id,
                                             locationId: create(:campaign_location).id } }])

        expect(result[:errors].sole[:errors]).to contain_exactly('Parent must belong to the same campaign',
                                                                 'Giver npc must belong to the same campaign',
                                                                 'Location must belong to the same campaign')
        expect(quest.reload).to have_attributes(parent_id: nil, giver_npc_id: nil, location_id: nil)
      end

      it "rejects records that don't exist" do
        expect(push({ factionId: '999999999' })[:errors]).to contain_exactly(include(errors: ['Faction must exist']))
      end

      it 'rejects ids that are not ids' do
        result = push({ factionId: 'the-cult', statBlockReferenceId: -1 })

        expect(result[:errors]).to contain_exactly(
          include(errors: ['Faction must be a record id', 'Stat block reference must be a record id'])
        )
      end

      it 'rejects a place inside itself' do
        city = create(:campaign_location, campaign: campaign)
        district = create(:campaign_location, campaign: campaign, parent: city)

        result = sync.apply([{ type: 'location', uuid: city.uuid, baseVersion: city.sync_version,
                               attributes: { parentId: district.id.to_s } }])

        expect(result[:errors]).to contain_exactly(include(errors: ["Parent can't be this location or one inside it"]))
      end
    end

    describe 'values' do
      def push(record, type, attributes)
        sync.apply([{ type: type, uuid: record.uuid, baseVersion: record.sync_version, attributes: attributes }])
      end

      it 'rejects a list or object for a plain field' do
        session = create(:campaign_session, campaign: campaign)

        expect(push(session, 'session', { title: { text: 'Outbreak' }, log: ['Fled'] })[:errors])
          .to contain_exactly(include(errors: ['Title is invalid', 'Log is invalid']))
      end

      it "rejects a date that isn't one" do
        session = create(:campaign_session, campaign: campaign)

        expect(push(session, 'session', { scheduledOn: 'next week' })[:errors])
          .to contain_exactly(include(errors: ['Scheduled on must be a date (YYYY-MM-DD)']))
        expect(push(session, 'session', { scheduledOn: nil })[:applied].size).to eq(1)
      end

      it "rejects a null for a field that can't be empty" do
        secret = create(:campaign_secret, campaign: campaign, position: 1)

        expect(push(secret, 'secret', { position: nil, text: nil })[:errors])
          .to contain_exactly(include(errors: contain_exactly("Text can't be blank", "Position can't be blank")))
        expect(secret.reload.position).to eq(1)
      end

      it "rejects portents that aren't objects" do
        expect(push(front, 'front', { portents: ['Villages fall'] })[:errors])
          .to contain_exactly(include(errors: [/Portents must be/]))
      end

      it "rejects attributes that aren't an object" do
        expect(push(front, 'front', 'clockFilled')[:errors])
          .to contain_exactly(include(errors: ['attributes must be an object']))
      end

      it 'reports a number too big to save' do
        secret = create(:campaign_secret, campaign: campaign)

        expect(push(secret, 'secret', { position: 10**12 })[:errors]).to contain_exactly(include(errors: ['A number is out of range']))
      end
    end

    describe "a session's or quest's links" do
      let(:session) { create(:campaign_session, campaign: campaign) }
      let(:secret) { create(:campaign_secret, campaign: campaign) }
      let(:npc) { create(:campaign_npc, campaign: campaign, name: 'Vex') }
      let(:potion) { create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item') }
      let(:zombie) { create(:monster, user: nil) }

      def push_links(owner, type, links, attributes = {})
        sync.apply([{ type: type, uuid: owner.uuid, baseVersion: owner.reload.sync_version,
                      attributes: attributes.merge(links: links) }])
      end

      def link_to(record, quantity = nil)
        { linkableType: record.class.base_class.name, linkableId: record.id.to_s, quantity: quantity }
      end

      it 'removes, adds, reorders and sets quantities to match the list' do
        kept = session.links.create!(linkable: secret, position: 0)
        removed = session.links.create!(linkable: npc, position: 1)
        treasure = session.links.create!(linkable: potion, position: 2, quantity: 1)
        cursor = sync.changes_since(0)[:cursor]

        result = push_links(session, 'session', [link_to(potion, 3), { linkableType: 'Monster', linkableId: zombie.id }, link_to(secret)])

        expect(result[:applied].sole[:current][:links]).to match(
          [include(linkableType: 'CampaignReference', name: 'Potion of Healing', quantity: 3, position: 0),
           include(linkableType: 'Monster', linkableId: zombie.id.to_s, quantity: nil, position: 1),
           include(linkableType: 'CampaignSecret', name: secret.text, quantity: nil, position: 2)]
        )
        expect(session.links.reload.pluck(:id).values_at(0, 2)).to eq([treasure.id, kept.id])
        expect(CampaignSessionLink.exists?(removed.id)).to be false

        pulled = sync.changes_since(cursor)
        expect(pulled[:records]['sessions'].sole[:links].pluck(:name)).to eq(['Potion of Healing', zombie.name, secret.text])
        expect(pulled[:tombstones]).to contain_exactly(include(type: 'CampaignSessionLink', uuid: removed.uuid))
      end

      it "sets a quest's NPCs and reward items" do
        quest = create(:campaign_quest, campaign: campaign)
        sword = create(:magic_item, user: nil)

        result = push_links(quest, 'quest', [link_to(npc), link_to(potion, 2), { linkableType: 'Item', linkableId: sword.id.to_s }])

        expect(result[:errors]).to eq([])
        expect(quest.links.reload.map { |link| [link.linkable_type, link.linkable_id, link.quantity, link.position] })
          .to eq([['CampaignNpc', npc.id, nil, 0], ['CampaignReference', potion.id, 2, 1], ['Item', sword.id, nil, 2]])
      end

      describe "monsters in a quest's links, from an older module or a change queued before quests had encounters" do
        let(:quest) { create(:campaign_quest, campaign: campaign) }
        let(:fanatic) { create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', category: 'monster') }

        it 'moves them into a new fight, keeping their order and how many, and applies the rest of the change' do
          result = push_links(quest, 'quest', [link_to(npc), { linkableType: 'Monster', linkableId: zombie.id, quantity: 4 },
                                               link_to(potion, 2), link_to(fanatic)], { name: 'Renamed' })

          expect(result[:errors]).to eq([])
          expect(result[:applied].sole[:current]).to include(name: 'Renamed')
          expect(quest.reload.links.map(&:linkable)).to eq([npc, potion])
          encounter = quest.encounters.sole
          expect(encounter).to have_attributes(name: 'Encounter', kind: 'combat', position: 0, campaign: campaign)
          expect(encounter.links.map { |link| [link.linkable, link.quantity, link.position] })
            .to eq([[zombie, 4, 0], [fanatic, nil, 1]])
        end

        it "adds them after the quest's first encounter's monsters, taking the count sent for one it has" do
          first = create(:campaign_encounter, quest: quest, name: 'Ambush', position: 0)
          create(:campaign_encounter, quest: quest, name: 'Lair', position: 1)
          ghoul = create(:monster, user: nil)
          first.links.create!(linkable: ghoul, position: 0)
          first.links.create!(linkable: zombie, position: 1, quantity: 2)

          result = push_links(quest, 'quest', [{ linkableType: 'Monster', linkableId: zombie.id, quantity: 5 }, link_to(fanatic, 3)])

          expect(result[:errors]).to eq([])
          expect(quest.encounters.count).to eq(2)
          expect(first.links.reload.map { |link| [link.linkable, link.quantity, link.position] })
            .to eq([[ghoul, nil, 0], [zombie, 5, 1], [fanatic, 3, 2]])
          expect(quest.links.reload).to be_empty
        end

        it 'pulls the encounter they went into' do
          cursor = sync.changes_since(0)[:cursor]

          push_links(quest, 'quest', [{ linkableType: 'Monster', linkableId: zombie.id }])

          expect(sync.changes_since(cursor)[:records]['encounters'])
            .to contain_exactly(include(questId: quest.id.to_s, links: [include(linkableType: 'Monster', linkableId: zombie.id.to_s)]))
        end

        it 'does it for a quest created from Foundry too' do
          uuid = SecureRandom.uuid

          result = sync.apply([{ op: 'create', type: 'quest', uuid: uuid,
                                 attributes: { name: 'Find the crypt', links: [{ linkableType: 'Monster', linkableId: zombie.id }] } }])

          expect(result[:errors]).to eq([])
          expect(CampaignQuest.find_by!(uuid: uuid).encounters.sole.links.sole.linkable).to eq(zombie)
        end
      end

      it "sets an encounter's monsters with how many, its NPCs and its reward items" do
        encounter = create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))
        fanatic = create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', category: 'monster')
        sword = create(:magic_item, user: nil)

        result = push_links(encounter, 'encounter', [{ linkableType: 'Monster', linkableId: zombie.id, quantity: 4 },
                                                     link_to(fanatic), link_to(npc), link_to(potion, 2),
                                                     { linkableType: 'Item', linkableId: sword.id.to_s }])

        expect(result[:errors]).to eq([])
        expect(result[:applied].sole[:current][:links].pluck(:name, :quantity))
          .to eq([[zombie.name, 4], ['Cult Fanatic', nil], ['Vex', nil], ['Potion of Healing', 2], [sword.name, nil]])
        expect(encounter.links.reload.map { |link| [link.linkable_type, link.position] })
          .to eq([['Monster', 0], ['CampaignReference', 1], ['CampaignNpc', 2], ['CampaignReference', 3], ['Item', 4]])
      end

      it 'removes them all for an empty list' do
        session.links.create!(linkable: npc)

        result = push_links(session, 'session', [])

        expect(result[:applied].sole[:current][:links]).to eq([])
        expect(session.links.reload).to be_empty
      end

      it 'leaves a link alone when it is unchanged' do
        link = session.links.create!(linkable: npc, quantity: 2)
        version = link.reload.sync_version

        push_links(session, 'session', [link_to(npc, 2)])

        expect(link.reload.sync_version).to eq(version)
      end

      it "keeps the links when they aren't sent" do
        session.links.create!(linkable: npc)

        sync.apply([{ type: 'session', uuid: session.uuid, baseVersion: session.reload.sync_version, attributes: { title: 'Outbreak' } }])

        expect(session.links.reload.map(&:linkable)).to eq([npc])
      end

      describe 'that are invalid' do
        before { session.links.create!(linkable: npc) }

        # The rest of the change isn't saved either
        def expect_rejected(links, error, owner: session, type: 'session')
          field = type == 'session' ? :title : :name
          result = push_links(owner, type, links, { field => 'Renamed' })

          expect(result[:errors]).to contain_exactly(include(uuid: owner.uuid, errors: include(error)))
          expect(owner.reload.public_send(field)).not_to eq('Renamed')
        end

        it "rejects another campaign's records, saving nothing from the change" do
          stranger = create(:campaign_npc, name: 'Stranger')

          expect_rejected([link_to(potion), link_to(stranger)],
                          "Links: CampaignNpc #{stranger.id}: Linkable is not available to this campaign")
          expect(session.links.reload.map(&:linkable)).to eq([npc])
        end

        it "rejects someone else's homebrew monster" do
          homebrew = create(:monster, user: create(:dungeon_master_user))

          expect_rejected([{ linkableType: 'Monster', linkableId: homebrew.id }],
                          "Links: Monster #{homebrew.id}: Linkable is not available to this campaign")
          expect(session.links.reload.map(&:linkable)).to eq([npc])
        end

        it "rejects records that don't exist" do
          expect_rejected([{ linkableType: 'CampaignSecret', linkableId: '999999999' }],
                          'Links: CampaignSecret 999999999: Linkable must exist')
        end

        it "rejects what a session can't link" do
          expect_rejected([{ linkableType: 'CampaignFaction', linkableId: '1' }],
                          'Links: "CampaignFaction" can\'t be linked to a session')
        end

        it "rejects what a quest can't link" do
          quest = create(:campaign_quest, campaign: campaign)

          expect_rejected([link_to(secret)], 'Links: "CampaignSecret" can\'t be linked to a quest', owner: quest, type: 'quest')
          expect(quest.links.reload).to be_empty
        end

        it "rejects a quest's monsters that the website couldn't link, saving nothing from the change" do
          quest = create(:campaign_quest, campaign: campaign)
          homebrew = create(:monster, user: create(:dungeon_master_user))

          expect_rejected([link_to(npc), { linkableType: 'Monster', linkableId: homebrew.id }],
                          "Links: Monster #{homebrew.id}: Linkable is not available to this campaign", owner: quest, type: 'quest')
          expect(quest.links.reload).to be_empty
          expect(quest.encounters.reload).to be_empty
        end

        it "rejects what an encounter can't link" do
          encounter = create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))

          expect_rejected([link_to(secret)], 'Links: "CampaignSecret" can\'t be linked to an encounter', owner: encounter,
                                                                                                      type: 'encounter')
          expect(encounter.links.reload).to be_empty
        end

        it 'rejects ids that are not ids' do
          expect_rejected([{ linkableType: 'CampaignNpc', linkableId: 'vex' }], 'Links: CampaignNpc vex is not a record id')
        end

        it 'rejects a record listed twice' do
          expect_rejected([link_to(npc), link_to(npc, 2)], "Links: CampaignNpc #{npc.id} is listed more than once")
        end

        it 'rejects a bad quantity' do
          expect_rejected([link_to(potion, 0)], /Links: CampaignReference #{potion.id}: Quantity must be/)
        end

        it "rejects links that aren't a list" do
          expect_rejected(link_to(npc), 'Links must be a list of links')
        end

        it 'rejects too many' do
          expect_rejected(Array.new(CampaignSync::Links::MAX_LINKS + 1) { link_to(npc) }, 'Links: no more than 100')
        end
      end
    end

    describe 'creating records' do
      let(:uuid) { SecureRandom.uuid }

      def create_change(type, attributes, uuid: self.uuid)
        { op: 'create', type: type, uuid: uuid, attributes: attributes }
      end

      {
        'faction' => [CampaignFaction, { name: 'Cult of Nerull', goal: 'Raise the dead' }],
        'location' => [CampaignLocation, { name: 'The Crypt', features: ['Bones'] }],
        'npc' => [CampaignNpc, { name: 'Vex', role: 'bbeg' }],
        'front' => [CampaignFront, { name: 'The Plague', clockSegments: 8, stakes: ['Will the city fall?'] }],
        'quest' => [CampaignQuest, { name: 'Find the crypt', kind: 'side', rewardXp: 300 }],
        'secret' => [CampaignSecret, { text: 'The mayor is a ghoul', revelation: 'The mayor' }],
        'session' => [CampaignSession, { title: 'Outbreak', level: 3 }],
        'reference' => [CampaignReference, { name: 'Cult Fanatic', book: 'mm', category: 'monster', page: 92 }]
      }.each do |type, (model, attributes)|
        it "creates a #{type} with the uuid from Foundry" do
          result = sync.apply([create_change(type, attributes)])

          record = model.find_by!(uuid: uuid)
          expect(record.campaign).to eq(campaign)
          expect(result[:applied]).to contain_exactly(
            include(type: type, uuid: uuid,
                    current: include(attributes.merge(id: record.id.to_s, uuid: uuid, syncVersion: record.sync_version)))
          )
          expect(sync.changes_since(0)[:records]["#{type}s"]).to contain_exactly(include(uuid: uuid))
        end
      end

      it "points the new records at the campaign's records, and links them" do
        faction = create(:campaign_faction, campaign: campaign)
        npc = create(:campaign_npc, campaign: campaign, name: 'Vex')
        session = create(:campaign_session, campaign: campaign)
        quest_uuid = SecureRandom.uuid

        result = sync.apply([
                              create_change('npc', { name: 'Sildar', factionId: faction.id.to_s }),
                              create_change('quest', { name: 'Find the crypt', giverNpcId: npc.id,
                                                       links: [{ linkableType: 'CampaignNpc', linkableId: npc.id.to_s }] },
                                            uuid: quest_uuid),
                              create_change('secret', { text: 'The mayor', revealed: true, revealedSessionUuid: session.uuid },
                                            uuid: SecureRandom.uuid)
                            ])

        expect(result[:errors]).to eq([])
        expect(CampaignNpc.find_by!(uuid: uuid).faction).to eq(faction)
        quest = CampaignQuest.find_by!(uuid: quest_uuid)
        expect(quest.giver_npc).to eq(npc)
        expect(quest.links.map { |link| [link.linkable, link.position] }).to eq([[npc, 0]])
        expect(result[:applied].second[:current][:links]).to contain_exactly(include(linkableType: 'CampaignNpc', name: 'Vex'))
        expect(campaign.secrets.sole).to have_attributes(revealed?: true, revealed_session: session)
      end

      it 'numbers a new session after the last one' do
        create(:campaign_session, campaign: campaign)

        result = sync.apply([create_change('session', { title: 'Next' })])

        expect(result[:applied].sole[:current]).to include(number: 2)
      end

      it 'takes an upper-case uuid in its lower-case form' do
        result = sync.apply([create_change('faction', { name: 'Cult' }, uuid: uuid.upcase)])

        expect(result[:applied].sole[:uuid]).to eq(uuid)
      end

      it "rejects a uuid that isn't a UUID v4" do
        bad = ['the-cult', 'c232ab00-9414-11ec-b3c8-9f6bdeced846', nil, 42]

        result = sync.apply(bad.map { |value| create_change('faction', { name: 'Cult' }, uuid: value) })

        expect(result[:errors]).to eq(bad.map { |value| { uuid: value, errors: ['uuid must be a UUID v4'] } })
        expect(campaign.factions).to be_empty
      end

      it 'rejects a uuid already used, by anything in the campaign or anywhere by its type' do
        used = [create(:campaign_faction, campaign: campaign).uuid, create(:campaign_npc, campaign: campaign).uuid,
                campaign.uuid, create(:campaign_faction, campaign: campaign).tap(&:destroy!).uuid, create(:campaign_faction).uuid]

        result = sync.apply(used.map { |value| create_change('faction', { name: 'Copy' }, uuid: value) })

        expect(result[:errors]).to eq(used.map { |value| { uuid: value, errors: ['uuid is already used'] } })
        expect(CampaignFaction.where(name: 'Copy')).to be_empty
      end

      it "can't create a campaign" do
        result = sync.apply([create_change('campaign', { name: 'Another' })])

        expect(result[:errors]).to contain_exactly(include(uuid: uuid, errors: ["Can't create a campaign from Foundry"]))
        expect(Campaign.where(name: 'Another')).to be_empty
      end

      it 'reports validation errors and creates nothing' do
        result = sync.apply([create_change('npc', { role: 'overlord' })])

        expect(result[:errors]).to contain_exactly(
          include(uuid: uuid, errors: contain_exactly("Name can't be blank", 'Role is not included in the list'))
        )
        expect(CampaignNpc.where(uuid: uuid)).to be_empty
      end

      it 'creates nothing when its links are invalid' do
        stranger = create(:campaign_npc)

        result = sync.apply([create_change('quest', { name: 'Find the crypt',
                                                      links: [{ linkableType: 'CampaignNpc', linkableId: stranger.id }] })])

        expect(result[:errors].sole[:errors]).to eq(["Links: CampaignNpc #{stranger.id}: Linkable is not available to this campaign"])
        expect(CampaignQuest.where(uuid: uuid)).to be_empty
      end
    end

    describe 'deleting records' do
      def delete_change(type, uuid)
        { op: 'delete', type: type, uuid: uuid }
      end

      it 'deletes the record and leaves a tombstone for the next pull' do
        faction = create(:campaign_faction, campaign: campaign)
        cursor = sync.changes_since(0)[:cursor]

        result = sync.apply([delete_change('faction', faction.uuid)])

        expect(result).to include(applied: [], conflicts: [], errors: [], deleted: [faction.uuid])
        expect(CampaignFaction.exists?(faction.id)).to be false
        expect(sync.changes_since(cursor)[:tombstones]).to contain_exactly(include(type: 'CampaignFaction', uuid: faction.uuid))
      end

      it "counts a record that's already gone as deleted" do
        faction = create(:campaign_faction, campaign: campaign)
        missing = SecureRandom.uuid

        result = sync.apply([delete_change('faction', faction.uuid), delete_change('faction', faction.uuid),
                             delete_change('npc', missing)])

        expect(result).to include(errors: [], deleted: [faction.uuid, faction.uuid, missing])
        expect(CampaignTombstone.where(record_uuid: faction.uuid).count).to eq(1)
      end

      it "doesn't touch another campaign's record" do
        other = create(:campaign_npc)

        expect(sync.apply([delete_change('npc', other.uuid)])[:deleted]).to eq([other.uuid])
        expect(CampaignNpc.exists?(other.id)).to be true
      end

      it "can't delete the campaign" do
        result = sync.apply([delete_change('campaign', campaign.uuid)])

        expect(result[:errors]).to contain_exactly(include(uuid: campaign.uuid, errors: ["Can't delete a campaign from Foundry"]))
        expect(Campaign.exists?(campaign.id)).to be true
      end

      it "rejects a uuid that isn't a UUID" do
        expect(sync.apply([delete_change('npc', 'vex')])[:errors]).to eq([{ uuid: 'vex', errors: ['uuid must be a UUID'] }])
      end

      describe 'what pointed at it, in the next pull' do
        def delete_and_pull(type, record)
          cursor = sync.changes_since(0)[:cursor]
          expect(sync.apply([delete_change(type, record.uuid)])[:deleted]).to eq([record.uuid])
          sync.changes_since(cursor)
        end

        it "clears an NPC from the quests it gave and fronts it led, and removes its links" do
          npc = create(:campaign_npc, campaign: campaign)
          quest = create(:campaign_quest, campaign: campaign, giver_npc: npc)
          quest.links.create!(linkable: npc)
          front = create(:campaign_front, campaign: campaign, npc: npc)
          session = create(:campaign_session, campaign: campaign)
          session.links.create!(linkable: npc)
          create(:campaign_quest, campaign: campaign)

          pulled = delete_and_pull('npc', npc)

          expect(pulled[:records]).to include(
            'quests' => [include(uuid: quest.uuid, giverNpcId: nil, links: [])],
            'fronts' => [include(uuid: front.uuid, npcId: nil)],
            'sessions' => [include(uuid: session.uuid, links: [])]
          )
          expect(pulled[:tombstones]).to contain_exactly(include(type: 'CampaignNpc', uuid: npc.uuid))
        end

        it 'clears a faction from its NPCs and fronts' do
          faction = create(:campaign_faction, campaign: campaign)
          npc = create(:campaign_npc, campaign: campaign, faction: faction)
          threat = create(:campaign_front, campaign: campaign, faction: faction)

          pulled = delete_and_pull('faction', faction)

          expect(pulled[:records]).to include('npcs' => [include(uuid: npc.uuid, factionId: nil)],
                                              'fronts' => [include(uuid: threat.uuid, factionId: nil)])
        end

        it 'clears a place from the places inside it and its quests' do
          city = create(:campaign_location, campaign: campaign)
          district = create(:campaign_location, campaign: campaign, parent: city)
          quest = create(:campaign_quest, campaign: campaign, location: city)

          pulled = delete_and_pull('location', city)

          expect(pulled[:records]).to include('locations' => [include(uuid: district.uuid, parentId: nil)],
                                              'quests' => [include(uuid: quest.uuid, locationId: nil)])
        end

        it 'clears a quest from its sub-quests' do
          quest = create(:campaign_quest, campaign: campaign)
          sub_quest = create(:campaign_quest, campaign: campaign, parent: quest)

          pulled = delete_and_pull('quest', quest)

          expect(pulled[:records]['quests']).to contain_exactly(include(uuid: sub_quest.uuid, parentId: nil))
        end

        it 'clears a session from the secrets revealed in it' do
          session = create(:campaign_session, campaign: campaign)
          secret = create(:campaign_secret, campaign: campaign, revealed: true, revealed_session: session)

          pulled = delete_and_pull('session', session)

          expect(pulled[:records]['secrets']).to contain_exactly(include(uuid: secret.uuid, revealed: true, revealedSessionId: nil))
        end

        it 'clears a book reference from the NPCs using it, and removes its links' do
          reference = create(:campaign_reference, campaign: campaign)
          npc = create(:campaign_npc, campaign: campaign, stat_block_reference: reference)
          encounter = create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))
          encounter.links.create!(linkable: reference, quantity: 2)

          pulled = delete_and_pull('reference', reference)

          expect(pulled[:records]).to include('npcs' => [include(uuid: npc.uuid, statBlockReference: nil)],
                                              'encounters' => [include(uuid: encounter.uuid, links: [])])
        end

        it "deletes a quest's encounters with it, each leaving a tombstone" do
          quest = create(:campaign_quest, campaign: campaign)
          encounter = create(:campaign_encounter, quest: quest)

          pulled = delete_and_pull('quest', quest)

          expect(pulled[:tombstones]).to contain_exactly(include(type: 'CampaignQuest', uuid: quest.uuid),
                                                         include(type: 'CampaignEncounter', uuid: encounter.uuid))
        end
      end
    end

    describe 'a batch of changes' do
      it 'applies each change on its own, so one that fails undoes only itself' do
        quest = create(:campaign_quest, campaign: campaign, name: 'Find the crypt')
        npc = create(:campaign_npc, campaign: campaign)
        faction_uuid = SecureRandom.uuid

        result = sync.apply([
                              { op: 'create', type: 'faction', uuid: faction_uuid, attributes: { name: 'Cult' } },
                              { op: 'update', type: 'quest', uuid: quest.uuid, baseVersion: quest.sync_version,
                                attributes: { name: 'Renamed', links: [{ linkableType: 'CampaignNpc', linkableId: create(:campaign_npc).id }] } },
                              { op: 'delete', type: 'npc', uuid: npc.uuid }
                            ])

        expect(result.keys).to eq(%i[applied conflicts errors deleted cursor])
        expect(result).to include(applied: [include(type: 'faction', uuid: faction_uuid)], conflicts: [],
                                  errors: [include(uuid: quest.uuid)], deleted: [npc.uuid], cursor: campaign.reload.sync_counter)
        expect(quest.reload.name).to eq('Find the crypt')
      end

      it 'rejects an unknown op' do
        result = sync.apply([{ op: 'upsert', type: 'npc', uuid: SecureRandom.uuid }])

        expect(result[:errors]).to contain_exactly(include(errors: ['Unknown op "upsert"']))
      end

      it "rejects a change that isn't an object" do
        expect(sync.apply(['npc'])[:errors]).to eq([{ uuid: nil, errors: ['Each change must be an object'] }])
      end
    end
  end
end
