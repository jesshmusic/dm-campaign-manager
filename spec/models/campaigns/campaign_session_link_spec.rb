require 'rails_helper'

RSpec.describe CampaignSessionLink, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:session) { create(:campaign_session, campaign: campaign) }
  let(:other_campaign) { create(:campaign, user: user) }

  def link_to(linkable)
    build(:campaign_session_link, session: session, linkable: linkable)
  end

  it 'has a valid factory' do
    expect(build(:campaign_session_link)).to be_valid
  end

  describe 'campaign records' do
    {
      CampaignSecret: :campaign_secret,
      CampaignLocation: :campaign_location,
      CampaignNpc: :campaign_npc,
      CampaignQuest: :campaign_quest,
      CampaignFront: :campaign_front,
      CampaignReference: :campaign_reference
    }.each do |type, factory|
      it "links a #{type} from the session's campaign" do
        link = link_to(create(factory, campaign: campaign))

        expect(link).to be_valid
        expect(link.linkable_type).to eq(type.to_s)
      end

      it "rejects a #{type} from another campaign, even one the DM owns" do
        link = link_to(create(factory, campaign: other_campaign))

        expect(link).not_to be_valid
        expect(link.errors[:linkable]).to include('is not available to this campaign')
      end
    end
  end

  describe 'compendium entries' do
    it 'links an SRD monster' do
      expect(link_to(create(:monster, user: nil))).to be_valid
    end

    it "links the DM's own homebrew monster" do
      expect(link_to(create(:monster, user: user))).to be_valid
    end

    it "rejects another user's homebrew monster" do
      link = link_to(create(:monster, user: create(:dungeon_master_user)))

      expect(link).not_to be_valid
      expect(link.errors[:linkable]).to include('is not available to this campaign')
    end

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

  it 'rejects types that cannot be linked' do
    link = link_to(create(:dungeon_master_user))

    expect(link).not_to be_valid
    expect(link.errors[:linkable_type]).to be_present
  end

  it 'requires the linked record to exist' do
    link = build(:campaign_session_link, session: session, linkable_type: 'CampaignNpc', linkable_id: 0)

    expect(link).not_to be_valid
    expect(link.errors[:linkable]).to include('must exist')
  end

  it 'links a record to a session only once' do
    npc = create(:campaign_npc, campaign: campaign)
    create(:campaign_session_link, session: session, linkable: npc)
    duplicate = link_to(npc)

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:linkable_id]).to include('is already linked to this session')
  end

  it 'can link the same record to several sessions' do
    npc = create(:campaign_npc, campaign: campaign)
    create(:campaign_session_link, session: session, linkable: npc)
    next_session = create(:campaign_session, campaign: campaign)

    expect(build(:campaign_session_link, session: next_session, linkable: npc)).to be_valid
  end

  describe '#as_json_for_api' do
    it 'names a campaign record' do
      link = create(:campaign_session_link, session: session,
                                            linkable: create(:campaign_npc, campaign: campaign, name: 'Gundren'))

      expect(link.as_json_for_api).to eq(id: link.id.to_s, uuid: link.uuid, linkableType: 'CampaignNpc',
                                         linkableId: link.linkable_id.to_s, name: 'Gundren', slug: nil, detail: nil,
                                         position: 0)
    end

    it "uses a secret's text as its name" do
      link = create(:campaign_session_link, session: session,
                                            linkable: create(:campaign_secret, campaign: campaign, text: 'The map lies'))

      expect(link.as_json_for_api[:name]).to eq('The map lies')
    end

    it 'cites the book and page of a book reference' do
      reference = create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', book: 'mm', page: 92)
      link = create(:campaign_session_link, session: session, linkable: reference)

      expect(link.as_json_for_api).to include(name: 'Cult Fanatic', detail: 'Monster Manual p. 92')
    end

    it 'includes the slug of a compendium entry' do
      monster = create(:monster, user: nil, name: 'Young Green Dragon')
      link = create(:campaign_session_link, session: session, linkable: monster)

      expect(link.as_json_for_api).to include(linkableType: 'Monster', name: 'Young Green Dragon', slug: monster.slug)
    end

    it "shows a monster's challenge rating" do
      monster = create(:monster, user: nil, name: 'Zombie', challenge_rating: '1/4')
      link = create(:campaign_session_link, session: session, linkable: monster)

      expect(link.as_json_for_api[:detail]).to eq('CR 1/4')
    end

    it "shows an item's rarity" do
      item = create(:magic_item, user: nil, rarity: 'uncommon')
      link = create(:campaign_session_link, session: session, linkable: item)

      expect(link.as_json_for_api[:detail]).to eq('uncommon')
    end
  end
end
