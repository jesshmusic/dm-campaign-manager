require 'rails_helper'

RSpec.describe CampaignFront, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_front, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }

    it 'defaults to an empty six-segment clock' do
      expect(described_class.new).to have_attributes(clock_segments: 6, clock_filled: 0, portents: [], stakes: [])
    end

    it 'allows clocks of 2 to 12 segments' do
      [2, 12].each do |segments|
        subject.clock_segments = segments
        expect(subject).to be_valid
      end
      [1, 13, 4.5].each do |segments|
        subject.clock_segments = segments
        expect(subject).not_to be_valid, "expected #{segments} segments to be invalid"
      end
    end

    it 'allows a full clock' do
      subject.assign_attributes(clock_segments: 4, clock_filled: 4)

      expect(subject).to be_valid
    end

    it 'rejects an overfilled clock' do
      subject.assign_attributes(clock_segments: 4, clock_filled: 5)

      expect(subject).not_to be_valid
      expect(subject.errors[:clock_filled]).to include("can't be more than the clock's segments")
    end

    it 'rejects a negative clock' do
      subject.clock_filled = -1

      expect(subject).not_to be_valid
    end

    it 'accepts up to 10 stakes as strings' do
      subject.stakes = Array.new(CampaignFront::MAX_STAKES) { |i| "Stake #{i}" }

      expect(subject).to be_valid
    end

    it 'rejects too many stakes or stakes that are not strings' do
      subject.stakes = Array.new(CampaignFront::MAX_STAKES + 1) { |i| "Stake #{i}" }
      expect(subject).not_to be_valid
      expect(subject.errors[:stakes]).to include('must be a list of up to 10 entries')

      subject.stakes = [{ 'text' => 'Nope' }]
      expect(subject).not_to be_valid
    end
  end

  describe 'portents' do
    subject(:front) { build(:campaign_front, campaign: campaign) }

    it 'keeps only text and triggered' do
      front.portents = [{ text: 'Crops fail', triggered: true, extra: 'dropped' }, { 'text' => 'Wolves howl' }]

      expect(front.portents).to eq([
                                     { 'text' => 'Crops fail', 'triggered' => true },
                                     { 'text' => 'Wolves howl', 'triggered' => false }
                                   ])
    end

    it 'casts triggered from form values' do
      front.portents = [{ text: 'A', triggered: 'true' }, { text: 'B', triggered: '0' }, { text: 'C', triggered: '' }]

      expect(front.portents.pluck('triggered')).to eq([true, false, false])
    end

    it 'accepts permitted request parameters' do
      params = ActionController::Parameters.new(portents: [{ text: 'Smoke rises', triggered: '1' }])
                                           .permit(portents: %i[text triggered])
      front.portents = params[:portents]

      expect(front.portents).to eq([{ 'text' => 'Smoke rises', 'triggered' => true }])
    end

    it 'treats nil as no portents' do
      front.portents = nil

      expect(front.portents).to eq([])
      expect(front).to be_valid
    end

    it 'persists the normalized portents' do
      front.portents = [{ text: 'Crops fail', triggered: true }]
      front.save!

      expect(front.reload.portents).to eq([{ 'text' => 'Crops fail', 'triggered' => true }])
    end

    it 'requires text on every portent' do
      front.portents = [{ text: 'Crops fail' }, { text: '' }]

      expect(front).not_to be_valid
      expect(front.errors[:portents]).to include('must be up to 10 portents, each with text')
    end

    it 'allows up to 10 portents' do
      front.portents = Array.new(CampaignFront::MAX_PORTENTS) { |i| { text: "Portent #{i}" } }
      expect(front).to be_valid

      front.portents = Array.new(CampaignFront::MAX_PORTENTS + 1) { |i| { text: "Portent #{i}" } }
      expect(front).not_to be_valid
    end
  end

  describe 'links' do
    it 'can be driven by an NPC and faction from the same campaign' do
      front = build(:campaign_front, campaign: campaign, npc: create(:campaign_npc, campaign: campaign),
                                     faction: create(:campaign_faction, campaign: campaign))

      expect(front).to be_valid
    end

    it 'rejects an NPC or faction from another campaign' do
      front = build(:campaign_front, campaign: campaign, npc: create(:campaign_npc), faction: create(:campaign_faction))

      expect(front).not_to be_valid
      expect(front.errors[:npc]).to include('must belong to the same campaign')
      expect(front.errors[:faction]).to include('must belong to the same campaign')
    end

    it 'is unlinked when its NPC is destroyed' do
      npc = create(:campaign_npc, campaign: campaign)
      front = create(:campaign_front, campaign: campaign, npc: npc)

      npc.destroy!

      expect(front.reload.npc_id).to be_nil
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the front' do
      npc = create(:campaign_npc, campaign: campaign)
      front = create(:campaign_front, campaign: campaign, name: 'Cult of the Dragon', goal: 'Free Tiamat',
                                      doom: 'Tiamat rises', stakes: ['Does Waterdeep fall?'],
                                      portents: [{ text: 'Raids begin' }], clock_segments: 8, clock_filled: 2, npc: npc)

      expect(front.as_json_for_api).to eq(
        id: front.id.to_s, uuid: front.uuid, name: 'Cult of the Dragon', description: nil, goal: 'Free Tiamat',
        doom: 'Tiamat rises', stakes: ['Does Waterdeep fall?'], portents: [{ 'text' => 'Raids begin', 'triggered' => false }],
        clockSegments: 8, clockFilled: 2, npcId: npc.id.to_s, factionId: nil
      )
    end
  end
end
