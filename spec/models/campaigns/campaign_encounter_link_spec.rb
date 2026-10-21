require 'rails_helper'

RSpec.describe CampaignEncounterLink, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }
  let(:encounter) { create(:campaign_encounter, quest: quest) }
  let(:other_campaign) { create(:campaign, user: user) }

  def link_to(linkable, **attributes)
    build(:campaign_encounter_link, encounter: encounter, linkable: linkable, **attributes)
  end

  it 'has a valid factory' do
    expect(build(:campaign_encounter_link)).to be_valid
  end

  describe 'monsters' do
    it 'links an SRD monster, or the DM\'s own homebrew' do
      expect(link_to(create(:monster, user: nil))).to be_valid
      expect(link_to(create(:monster, user: user))).to be_valid
    end

    it "rejects another user's homebrew monster" do
      link = link_to(create(:monster, user: create(:dungeon_master_user)))

      expect(link).not_to be_valid
      expect(link.errors[:linkable]).to include('is not available to this campaign')
    end

    it 'links a book reference to a monster, and to anything else (a reward)' do
      %w[monster magic_item table].each do |category|
        expect(link_to(create(:campaign_reference, campaign: campaign, category: category))).to be_valid
      end
    end
  end

  describe 'campaign records' do
    { CampaignNpc: :campaign_npc, CampaignReference: :campaign_reference }.each do |type, factory|
      it "links a #{type} from the encounter's campaign" do
        expect(link_to(create(factory, campaign: campaign))).to be_valid
      end

      it "rejects a #{type} from another campaign" do
        link = link_to(create(factory, campaign: other_campaign))

        expect(link).not_to be_valid
        expect(link.errors[:linkable]).to include('is not available to this campaign')
      end
    end

    it "rejects campaign records an encounter doesn't link to" do
      %i[campaign_secret campaign_location campaign_quest campaign_front].each do |factory|
        link = link_to(create(factory, campaign: campaign))

        expect(link).not_to be_valid, "expected a #{factory} to be rejected"
        expect(link.errors[:linkable_type]).to be_present
      end
    end
  end

  it 'links a reward item, stored under the base Item type' do
    link = link_to(create(:magic_item, user: nil))

    expect(link).to be_valid
    expect(link.linkable_type).to eq('Item')
  end

  it 'links a record to an encounter only once' do
    monster = create(:monster, user: nil)
    create(:campaign_encounter_link, encounter: encounter, linkable: monster)

    duplicate = link_to(monster)
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:linkable_id]).to include('is already linked to this encounter')
  end

  it 'counts from 1 to 9999, or none (one)' do
    expect(link_to(create(:monster, user: nil), quantity: 9999)).to be_valid
    expect(link_to(create(:monster, user: nil), quantity: 0)).not_to be_valid
  end

  describe 'sync' do
    let(:link) { create(:campaign_encounter_link, encounter: encounter) }

    it 'bumps its encounter, not the quest, when it changes' do
      link
      quest_version = quest.reload.sync_version
      expect(encounter.reload.sync_version).to eq(campaign.reload.sync_counter)

      link.update!(quantity: 3)
      expect(encounter.reload.sync_version).to eq(campaign.reload.sync_counter)
      expect(quest.reload.sync_version).to eq(quest_version)
    end

    it 'leaves a tombstone and bumps its encounter when removed on its own' do
      link
      version = encounter.reload.sync_version

      expect { link.destroy! }.to change(CampaignTombstone, :count).by(1)
      expect(CampaignTombstone.last).to have_attributes(record_type: 'CampaignEncounterLink', record_uuid: link.uuid)
      expect(encounter.reload.sync_version).to be > version
    end
  end

  describe 'when the linked record is deleted' do
    it 'is removed with a monster, an item, an NPC or a book reference, and bumps the encounter' do
      records = [create(:monster, user: user), create(:magic_item, user: user), create(:campaign_npc, campaign: campaign),
                 create(:campaign_reference, campaign: campaign)]
      records.each { |record| create(:campaign_encounter_link, encounter: encounter, linkable: record) }
      version = encounter.reload.sync_version

      records.each { |record| expect { record.destroy! }.to change(described_class, :count).by(-1) }
      expect(encounter.reload.sync_version).to be > version
    end
  end
end
