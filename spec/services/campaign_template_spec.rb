require 'rails_helper'

RSpec.describe CampaignTemplate do
  let(:campaign) { create(:campaign) }
  let(:untriggered_portents) do
    CampaignTemplate::PORTENTS.map { |text| { 'text' => text, 'triggered' => false } }
  end

  def apply(template)
    described_class.apply!(campaign, template)
    campaign.reload
  end

  it 'lists the available templates' do
    expect(CampaignTemplate::TEMPLATES).to eq(%w[blank three_act sandbox five_room])
  end

  describe 'blank' do
    it 'creates nothing' do
      apply('blank')

      expect([campaign.sessions, campaign.quests, campaign.fronts]).to all(be_empty)
    end
  end

  describe 'three_act' do
    it 'creates the planned number of sessions' do
      campaign.update!(planned_sessions: 4)
      apply('three_act')

      expect(campaign.sessions.order(:number).pluck(:number)).to eq([1, 2, 3, 4])
    end

    it 'creates six sessions when none are planned' do
      apply(:three_act)

      expect(campaign.sessions.count).to eq(CampaignTemplate::DEFAULT_ARC_SESSIONS)
    end

    it 'steps session levels from the starting to the target level' do
      campaign.update!(planned_sessions: 6, start_level: 1, target_level: 10)
      apply('three_act')

      expect(campaign.sessions.order(:number).pluck(:level)).to eq([1, 3, 5, 6, 8, 10])
    end

    it 'gains a level per session when the arc allows it' do
      campaign.update!(planned_sessions: 5, start_level: 3, target_level: 7)
      apply('three_act')

      expect(campaign.sessions.order(:number).pluck(:level)).to eq([3, 4, 5, 6, 7])
    end

    it 'keeps the starting level without a target' do
      campaign.update!(planned_sessions: 3, start_level: 4)
      apply('three_act')

      expect(campaign.sessions.pluck(:level)).to eq([4, 4, 4])
    end

    it 'leaves levels blank without a starting level' do
      campaign.update!(planned_sessions: 2, target_level: 5)
      apply('three_act')

      expect(campaign.sessions.pluck(:level)).to eq([nil, nil])
    end

    it 'uses the starting level for a single session' do
      campaign.update!(planned_sessions: 1, start_level: 2, target_level: 5)
      apply('three_act')

      expect(campaign.sessions.pluck(:level)).to eq([2])
    end

    it 'creates three main-quest acts in order' do
      apply('three_act')

      quests = campaign.quests.order(:position)
      expect(quests.pluck(:name)).to eq(CampaignTemplate::ACTS)
      expect(quests.pluck(:kind).uniq).to eq(['main'])
      expect(quests.pluck(:act)).to eq([1, 2, 3])
      expect(quests.pluck(:position)).to eq([0, 1, 2])
    end

    it 'creates a main threat whose clock matches the session count' do
      campaign.update!(planned_sessions: 8)
      apply('three_act')

      expect(campaign.fronts.sole).to have_attributes(name: 'Main threat', clock_segments: 8, clock_filled: 0,
                                                      portents: untriggered_portents)
    end

    it 'keeps the clock between 4 and 12 segments' do
      campaign.update!(planned_sessions: 2)
      apply('three_act')
      expect(campaign.fronts.sole.clock_segments).to eq(4)

      other = create(:campaign, planned_sessions: 20)
      described_class.apply!(other, 'three_act')
      expect(other.fronts.sole.clock_segments).to eq(12)
    end
  end

  describe 'sandbox' do
    before do
      campaign.update!(mode: 'sandbox', start_level: 3, planned_sessions: 10)
      apply('sandbox')
    end

    it "creates the main villain's front" do
      expect(campaign.fronts.sole).to have_attributes(name: 'Main villain', clock_segments: 6,
                                                      portents: untriggered_portents)
    end

    it 'creates a main questline' do
      expect(campaign.quests.sole).to have_attributes(name: 'Main questline', kind: 'main', act: 1)
    end

    it 'creates only the first session, at the starting level' do
      expect(campaign.sessions.sole).to have_attributes(number: 1, level: 3, scenes: [])
    end
  end

  describe 'five_room' do
    before do
      campaign.update!(mode: 'oneshot', start_level: 5)
      apply('five_room')
    end

    it 'creates a single adventure quest' do
      expect(campaign.quests.sole).to have_attributes(name: 'The adventure', kind: 'main')
    end

    it 'creates one session with the five rooms as scenes' do
      expect(campaign.sessions.sole).to have_attributes(number: 1, level: 5, scenes: CampaignTemplate::FIVE_ROOMS)
    end

    it 'creates no fronts' do
      expect(campaign.fronts).to be_empty
    end
  end

  it 'versions everything it creates through the campaign counter' do
    apply('three_act')

    versions = [campaign.sessions, campaign.quests, campaign.fronts].flat_map { |records| records.pluck(:sync_version) }
    expect(versions.uniq.size).to eq(versions.size)
    expect(campaign.sync_counter).to eq(versions.max)
  end
end
