# frozen_string_literal: true

# Starting structures for a new campaign, built without AI:
# - three_act: one session per planned session with levels stepping from the
#   starting to the target level, three main-quest acts, and a main threat
# - sandbox: a villain's front and a main questline; sessions are added as you go
# - five_room: a one-shot whose first session has Johnn Four's five rooms as scenes
class CampaignTemplate
  TEMPLATES = %w[blank three_act sandbox five_room].freeze
  DEFAULT_ARC_SESSIONS = 6
  ACTS = ['Act I: The hook', 'Act II: Complications', 'Act III: The showdown'].freeze
  FIVE_ROOMS = [
    'Entrance and guardian',
    'Puzzle or roleplaying challenge',
    'Trick or setback',
    'Climax: big battle or conflict',
    'Reward, revelation, or plot twist'
  ].freeze
  PORTENTS = ['The first sign of trouble', 'The threat grows bolder', 'Doom is at hand'].freeze

  def self.apply!(campaign, template)
    new(campaign).apply!(template)
  end

  def initialize(campaign)
    @campaign = campaign
  end

  def apply!(template)
    case template.to_s
    when 'three_act' then three_act!
    when 'sandbox' then sandbox!
    when 'five_room' then five_room!
    end
  end

  private

  def three_act!
    count = @campaign.planned_sessions || DEFAULT_ARC_SESSIONS
    count.times { |index| @campaign.sessions.create!(number: index + 1, level: level_for(index, count)) }
    ACTS.each_with_index do |name, index|
      @campaign.quests.create!(name: name, kind: 'main', act: index + 1, position: index)
    end
    @campaign.fronts.create!(name: 'Main threat', clock_segments: count.clamp(4, 12), portents: portents)
  end

  def sandbox!
    @campaign.fronts.create!(name: 'Main villain', clock_segments: 6, portents: portents)
    @campaign.quests.create!(name: 'Main questline', kind: 'main', act: 1)
    @campaign.sessions.create!(number: 1, level: @campaign.start_level)
  end

  def five_room!
    @campaign.quests.create!(name: 'The adventure', kind: 'main')
    @campaign.sessions.create!(number: 1, level: @campaign.start_level, scenes: FIVE_ROOMS)
  end

  def portents
    PORTENTS.map { |text| { text: text, triggered: false } }
  end

  # Spread levels evenly from the starting to the target level
  def level_for(index, count)
    start = @campaign.start_level
    return start if start.nil? || count == 1

    target = @campaign.target_level || start
    start + ((target - start) * index.to_f / (count - 1)).round
  end
end
