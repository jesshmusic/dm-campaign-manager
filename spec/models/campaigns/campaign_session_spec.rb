require 'rails_helper'

RSpec.describe CampaignSession, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_session, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_length_of(:title).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:status).in_array(CampaignSession::STATUSES) }

    it 'defaults to planned with no scenes' do
      expect(described_class.new).to have_attributes(status: 'planned', scenes: [])
    end

    it 'requires a positive number' do
      session = create(:campaign_session, campaign: campaign)

      session.number = 0
      expect(session).not_to be_valid

      session.number = 1.5
      expect(session).not_to be_valid
    end

    it 'allows levels from 1 to 20 or none' do
      [nil, 1, 20].each do |level|
        subject.level = level
        expect(subject).to be_valid
      end
      [0, 21].each do |level|
        subject.level = level
        expect(subject).not_to be_valid
      end
    end

    it 'accepts up to 20 scenes as strings' do
      subject.scenes = Array.new(CampaignSession::MAX_SCENES) { |i| "Scene #{i}" }
      expect(subject).to be_valid

      subject.scenes = Array.new(CampaignSession::MAX_SCENES + 1) { |i| "Scene #{i}" }
      expect(subject).not_to be_valid
      expect(subject.errors[:scenes]).to include('must be a list of up to 20 entries')
    end

    it 'rejects scenes that are not strings' do
      subject.scenes = [1, 2]

      expect(subject).not_to be_valid
    end
  end

  describe 'numbering' do
    it 'numbers sessions in order' do
      first = create(:campaign_session, campaign: campaign)
      second = create(:campaign_session, campaign: campaign)

      expect([first.number, second.number]).to eq([1, 2])
    end

    it 'continues after the highest number' do
      create(:campaign_session, campaign: campaign, number: 5)

      expect(create(:campaign_session, campaign: campaign).number).to eq(6)
    end

    it 'numbers each campaign separately' do
      create(:campaign_session, campaign: campaign)

      expect(create(:campaign_session).number).to eq(1)
    end

    it 'keeps an explicit number' do
      expect(create(:campaign_session, campaign: campaign, number: 3).number).to eq(3)
    end

    it 'rejects a number already used in the campaign' do
      create(:campaign_session, campaign: campaign, number: 1)
      duplicate = build(:campaign_session, campaign: campaign, number: 1)

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:number]).to include('has already been taken')
    end

    it 'allows the same number in different campaigns' do
      create(:campaign_session, number: 1)

      expect(build(:campaign_session, campaign: campaign, number: 1)).to be_valid
    end
  end

  describe '#display_title' do
    it 'uses the title when present' do
      expect(build(:campaign_session, title: 'The Sunless Citadel').display_title).to eq('The Sunless Citadel')
    end

    it 'falls back to the session number' do
      expect(build(:campaign_session, number: 4, title: '').display_title).to eq('Session 4')
    end
  end

  describe 'links' do
    let(:session) { create(:campaign_session, campaign: campaign) }

    it 'are ordered by position' do
      later = create(:campaign_session_link, session: session, position: 2)
      sooner = create(:campaign_session_link, session: session, position: 1)

      expect(session.reload.links).to eq([sooner, later])
    end

    it 'leave out links whose record was deleted' do
      kept = create(:campaign_npc, campaign: campaign, name: 'Kept')
      gone = create(:campaign_npc, campaign: campaign, name: 'Gone')
      create(:campaign_session_link, session: session, linkable: kept)
      create(:campaign_session_link, session: session, linkable: gone)

      gone.destroy!

      expect(session.reload.as_json_for_api[:links].pluck(:name)).to eq(['Kept'])
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the session' do
      session = create(:campaign_session, campaign: campaign, title: 'Goblin Ambush', scheduled_on: Date.new(2026, 10, 20),
                                          level: 2, strong_start: 'Arrows fly', scenes: ['Ambush', 'Cragmaw hideout'])

      expect(session.as_json_for_api).to include(
        id: session.id.to_s, uuid: session.uuid, number: 1, title: 'Goblin Ambush', displayTitle: 'Goblin Ambush',
        scheduledOn: '2026-10-20', status: 'planned', level: 2, strongStart: 'Arrows fly',
        scenes: ['Ambush', 'Cragmaw hideout'], links: []
      )
    end
  end

  it 'caps session numbers' do
    expect(build(:campaign_session, number: CampaignSession::MAX_NUMBER)).to be_valid
    expect(build(:campaign_session, number: CampaignSession::MAX_NUMBER + 1)).not_to be_valid
  end
end
