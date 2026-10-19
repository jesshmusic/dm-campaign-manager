require 'rails_helper'

# Sync bookkeeping shared by every planner record (CampaignSyncable)
RSpec.describe CampaignSyncable do
  let(:campaign) { create(:campaign) }
  let(:uuid_format) { /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/ }

  {
    campaign_faction: CampaignFaction,
    campaign_location: CampaignLocation,
    campaign_npc: CampaignNpc,
    campaign_front: CampaignFront,
    campaign_quest: CampaignQuest,
    campaign_secret: CampaignSecret,
    campaign_session: CampaignSession
  }.each do |factory, model|
    describe model do
      let(:record) { create(factory, campaign: campaign) }

      it 'assigns a uuid' do
        expect(record.uuid).to match(uuid_format)
      end

      it "takes a version from its campaign's counter on create and every save" do
        created_version = record.sync_version
        expect(created_version).to eq(campaign.reload.sync_counter)

        record.save!
        expect(record.sync_version).to be > created_version
        expect(record.reload.sync_version).to eq(campaign.reload.sync_counter)
      end

      it 'leaves a tombstone when destroyed on its own' do
        record
        expect { record.destroy! }.to change(CampaignTombstone, :count).by(1)

        tombstone = CampaignTombstone.last
        expect(tombstone).to have_attributes(campaign: campaign, record_type: model.name, record_uuid: record.uuid)
        expect(tombstone.sync_version).to be > record.sync_version
        expect(tombstone.sync_version).to eq(campaign.reload.sync_counter)
      end
    end
  end

  describe CampaignSessionLink do
    let(:session) { create(:campaign_session, campaign: campaign) }
    let(:link) { create(:campaign_session_link, session: session) }

    it 'assigns a uuid' do
      expect(link.uuid).to match(uuid_format)
    end

    it "is versioned by its session's campaign, and bumps its session" do
      link
      expect(link.sync_version).to be < campaign.reload.sync_counter
      expect(session.reload.sync_version).to eq(campaign.sync_counter)

      link.update!(position: 3)
      expect(link.reload.sync_version).to be > 0
      expect(session.reload.sync_version).to eq(campaign.reload.sync_counter)
    end

    it "leaves a tombstone in the session's campaign when destroyed on its own" do
      link
      expect { link.destroy! }.to change(CampaignTombstone, :count).by(1)

      expect(CampaignTombstone.last).to have_attributes(campaign: campaign, record_type: 'CampaignSessionLink',
                                                        record_uuid: link.uuid)
    end
  end

  it "shares one counter across all of a campaign's records" do
    faction = create(:campaign_faction, campaign: campaign)
    npc = create(:campaign_npc, campaign: campaign)
    session = create(:campaign_session, campaign: campaign)
    faction.update!(name: 'Renamed')

    expect([npc.sync_version, session.sync_version, faction.sync_version])
      .to eq([npc.sync_version, npc.sync_version + 1, npc.sync_version + 2])
    expect(campaign.reload.sync_counter).to eq(faction.sync_version)
  end

  it 'does not share counters between campaigns' do
    create_list(:campaign_faction, 3, campaign: campaign)

    expect(create(:campaign_faction).sync_version).to eq(1)
  end

  it 'leaves no tombstones when a whole campaign is destroyed' do
    session = create(:campaign_session, campaign: campaign)
    npc = create(:campaign_npc, campaign: campaign)
    create(:campaign_session_link, session: session, linkable: npc)
    create(:campaign_secret, campaign: campaign)
    create(:campaign_front, campaign: campaign, npc: npc)
    allow(CampaignTombstone).to receive(:create!).and_call_original

    campaign.destroy!

    expect(CampaignTombstone).not_to have_received(:create!)
  end

  describe 'deleting a record that others point at' do
    it "clears their pointers and bumps their versions, so a pull carries them" do
      npc = create(:campaign_npc, campaign: campaign)
      quest = create(:campaign_quest, campaign: campaign, giver_npc: npc)
      front = create(:campaign_front, campaign: campaign, npc: npc)
      before = campaign.reload.sync_counter

      npc.destroy!

      expect(quest.reload).to have_attributes(giver_npc_id: nil, sync_version: be > before)
      expect(front.reload).to have_attributes(npc_id: nil, sync_version: be > before)
      expect([quest.sync_version, front.sync_version].uniq.size).to eq(2)
      expect(CampaignTombstone.last.sync_version).to eq(campaign.reload.sync_counter)
    end

    it 'knows every pointer between planner records' do
      expect(CampaignNpc.pointers).to contain_exactly([CampaignFront, 'npc_id'], [CampaignQuest, 'giver_npc_id'])
      expect(CampaignFaction.pointers).to contain_exactly([CampaignNpc, 'faction_id'], [CampaignFront, 'faction_id'])
      expect(CampaignLocation.pointers).to contain_exactly([CampaignLocation, 'parent_id'], [CampaignQuest, 'location_id'])
      expect(CampaignQuest.pointers).to contain_exactly([CampaignQuest, 'parent_id'])
      expect(CampaignSession.pointers).to contain_exactly([CampaignSecret, 'revealed_session_id'])
      expect(CampaignReference.pointers).to contain_exactly([CampaignNpc, 'stat_block_reference_id'])
      expect([CampaignFront, CampaignSecret].flat_map(&:pointers)).to eq([])
    end

    it "leaves another campaign's records alone" do
      npc = create(:campaign_npc, campaign: campaign)
      other = create(:campaign_quest)
      other.update_column(:giver_npc_id, npc.id)
      version = other.sync_version

      npc.destroy!

      expect(other.reload).to have_attributes(giver_npc_id: nil, sync_version: version)
    end
  end

  it 'leaves a tombstone for a destroyed session but not for the links destroyed with it' do
    session = create(:campaign_session, campaign: campaign)
    create(:campaign_session_link, session: session)

    expect { session.destroy! }.to change(CampaignTombstone, :count).by(1)
    expect(CampaignTombstone.last.record_type).to eq('CampaignSession')
    expect(CampaignSessionLink.count).to eq(0)
  end
end
