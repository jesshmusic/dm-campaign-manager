require 'rails_helper'

RSpec.describe CampaignQuestLink, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }
  let(:other_campaign) { create(:campaign, user: user) }

  def link_to(linkable, **attributes)
    build(:campaign_quest_link, quest: quest, linkable: linkable, **attributes)
  end

  it 'has a valid factory' do
    expect(build(:campaign_quest_link)).to be_valid
  end

  describe 'campaign records' do
    { CampaignNpc: [:campaign_npc, {}], CampaignReference: [:campaign_reference, { category: 'magic_item' }] }
      .each do |type, (factory, attributes)|
      it "links a #{type} from the quest's campaign" do
        link = link_to(create(factory, campaign: campaign, **attributes))

        expect(link).to be_valid
        expect(link.linkable_type).to eq(type.to_s)
      end

      it "rejects a #{type} from another campaign, even one the DM owns" do
        link = link_to(create(factory, campaign: other_campaign, **attributes))

        expect(link).not_to be_valid
        expect(link.errors[:linkable]).to include('is not available to this campaign')
      end
    end

    it "rejects campaign records a quest doesn't link to" do
      %i[campaign_secret campaign_location campaign_quest campaign_front].each do |factory|
        link = link_to(create(factory, campaign: campaign))

        expect(link).not_to be_valid, "expected a #{factory} to be rejected"
        expect(link.errors[:linkable_type]).to be_present
      end
    end
  end

  describe 'monsters' do
    it "rejects DM Guru's monsters: they go in the quest's encounters" do
      link = link_to(create(:monster, user: nil))

      expect(link).not_to be_valid
      expect(link.errors[:linkable_type]).to be_present
    end

    it 'rejects book references to monsters, but not to anything else' do
      link = link_to(create(:campaign_reference, campaign: campaign, category: 'monster'))

      expect(link).not_to be_valid
      expect(link.errors[:linkable]).to include("is a monster: monsters go in the quest's encounters")

      %w[magic_item equipment spell table rule other].each do |category|
        expect(link_to(create(:campaign_reference, campaign: campaign, category: category))).to be_valid
      end
    end
  end

  describe 'compendium entries' do
    it 'links an SRD item, stored under the base Item type' do
      link = link_to(create(:magic_item, user: nil))

      expect(link).to be_valid
      expect(link.linkable_type).to eq('Item')
    end

    it "rejects another user's homebrew item" do
      link = link_to(create(:item, user: create(:dungeon_master_user)))

      expect(link).not_to be_valid
      expect(link.errors[:linkable]).to include('is not available to this campaign')
    end
  end

  it 'requires the linked record to exist' do
    link = build(:campaign_quest_link, quest: quest, linkable_type: 'CampaignNpc', linkable_id: 0)

    expect(link).not_to be_valid
    expect(link.errors[:linkable]).to include('must exist')
  end

  it 'links a record to a quest only once, but to several quests' do
    npc = create(:campaign_npc, campaign: campaign)
    create(:campaign_quest_link, quest: quest, linkable: npc)

    duplicate = link_to(npc)
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:linkable_id]).to include('is already linked to this quest')

    expect(build(:campaign_quest_link, quest: create(:campaign_quest, campaign: campaign), linkable: npc)).to be_valid
  end

  describe 'quantity' do
    subject(:link) { link_to(create(:magic_item, user: nil)) }

    it 'has none by default, and allows 1 to 9999' do
      expect(link.quantity).to be_nil
      expect(link).to be_valid

      [1, CampaignQuestLink::MAX_QUANTITY].each do |quantity|
        link.quantity = quantity
        expect(link).to be_valid
      end
    end

    it 'rejects counts that are not whole numbers from 1 to 9999' do
      [0, -1, CampaignQuestLink::MAX_QUANTITY + 1, 1.5].each do |quantity|
        link.quantity = quantity

        expect(link).not_to be_valid, "expected #{quantity.inspect} to be rejected"
        expect(link.errors[:quantity]).to be_present
      end
    end
  end

  describe 'sync' do
    let(:link) { create(:campaign_quest_link, quest: quest) }

    it "is versioned by its quest's campaign, and bumps its quest when it changes" do
      link
      expect(quest.reload.sync_version).to eq(campaign.reload.sync_counter)

      link.update!(quantity: 3)
      expect(quest.reload.sync_version).to eq(campaign.reload.sync_counter)
      expect(link.reload.sync_version).to be < quest.sync_version
    end

    it 'leaves a tombstone and bumps its quest when removed on its own' do
      link
      version = quest.reload.sync_version

      expect { link.destroy! }.to change(CampaignTombstone, :count).by(1)
      expect(CampaignTombstone.last).to have_attributes(campaign: campaign, record_type: 'CampaignQuestLink', record_uuid: link.uuid)
      expect(quest.reload.sync_version).to be > version
    end
  end

  describe 'when the linked record is deleted' do
    it 'is removed with an NPC or book reference, and bumps the quest' do
      npc = create(:campaign_npc, campaign: campaign)
      reference = create(:campaign_reference, campaign: campaign, category: 'magic_item')
      create(:campaign_quest_link, quest: quest, linkable: npc)
      create(:campaign_quest_link, quest: quest, linkable: reference)
      version = quest.reload.sync_version

      expect { npc.destroy! }.to change(described_class, :count).by(-1)
      expect { reference.destroy! }.to change(described_class, :count).by(-1)
      expect(quest.reload.sync_version).to be > version
    end

    it 'is removed with an item' do
      item = create(:magic_item, user: user)
      create(:campaign_quest_link, quest: quest, linkable: item, quantity: 2)

      expect { item.destroy! }.to change(described_class, :count).by(-1)
    end
  end

  describe '#as_json_for_api' do
    it 'has the shape of a session link' do
      link = create(:campaign_quest_link, quest: quest, linkable: create(:campaign_npc, campaign: campaign, name: 'Gundren'))

      expect(link.as_json_for_api).to eq(id: link.id.to_s, uuid: link.uuid, linkableType: 'CampaignNpc',
                                         linkableId: link.linkable_id.to_s, name: 'Gundren', slug: nil, detail: nil,
                                         challengeRating: nil, position: 0, quantity: nil)
    end

    it "shows an item's rarity and quantity" do
      item = create(:magic_item, user: nil, rarity: 'uncommon')

      expect(create(:campaign_quest_link, quest: quest, linkable: item, quantity: 2).as_json_for_api)
        .to include(linkableType: 'Item', name: item.name, detail: 'uncommon', quantity: 2)
    end

    it 'cites the book and page of a book reference' do
      reference = create(:campaign_reference, campaign: campaign, name: 'Bag of Holding', book: 'dmg', page: 224,
                                              category: 'magic_item')

      expect(create(:campaign_quest_link, quest: quest, linkable: reference).as_json_for_api)
        .to include(name: 'Bag of Holding', detail: "Dungeon Master's Guide p. 224")
    end
  end
end
