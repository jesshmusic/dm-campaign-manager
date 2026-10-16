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

    it 'ignores fields Foundry may not change' do
      sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                    attributes: { clockFilled: 2, name: 'Renamed' } }])

      expect(front.reload).to have_attributes(clock_filled: 2, name: front.name)
    end

    it 'reports validation errors' do
      result = sync.apply([{ type: 'front', uuid: front.uuid, baseVersion: front.sync_version,
                             attributes: { clockFilled: 99 } }])

      expect(result[:errors]).to contain_exactly(include(uuid: front.uuid))
      expect(front.reload.clock_filled).to eq(1)
    end

    it 'rejects record types Foundry may not change' do
      faction = create(:campaign_faction, campaign: campaign)

      result = sync.apply([{ type: 'faction', uuid: faction.uuid, baseVersion: faction.sync_version,
                             attributes: { name: 'X' } }])

      expect(result[:errors]).to contain_exactly(include(errors: [/Can't change/]))
      expect(faction.reload.name).not_to eq('X')
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

      it 'ignores the fields Foundry may not change' do
        push({ foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Renamed', description: 'Changed' })

        expect(location.reload).to have_attributes(foundry_scene_uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass',
                                                   description: nil)
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

      it 'ignores the fields Foundry may not change' do
        push({ foundryActorUuid: actor_uuid, name: 'Renamed', role: 'bbeg', secret: 'Changed' })

        expect(npc.reload).to have_attributes(foundry_actor_uuid: actor_uuid, name: 'Brother Ash', role: 'neutral', secret: nil)
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

      it "doesn't take links or the quest's other fields from Foundry" do
        push({ name: 'Renamed', reward: 'Changed', links: [{ linkableType: 'CampaignNpc', linkableId: '1' }], rewardXp: 10 })

        expect(quest.reload).to have_attributes(name: quest.name, reward: nil, reward_xp: 10)
        expect(quest.links).to be_empty
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
  end
end
