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
      npc = create(:campaign_npc, campaign: campaign)

      result = sync.apply([{ type: 'npc', uuid: npc.uuid, baseVersion: npc.sync_version, attributes: { name: 'X' } }])

      expect(result[:errors]).to contain_exactly(include(errors: [/Can't change/]))
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
