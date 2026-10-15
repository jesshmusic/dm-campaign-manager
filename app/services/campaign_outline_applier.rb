# frozen_string_literal: true

# Saves the parts of an AI outline (CampaignAssistant#outline) that the DM
# approved. The outline comes back from the browser, so every value is
# re-checked here: unknown keys are dropped, lists are capped, and names that
# link records (a faction, a front's leader, a quest giver) must match.
class CampaignOutlineApplier
  SECTIONS = %w[pitch truths factions npcs fronts locations quests secrets sessions].freeze
  LIMITS = { 'factions' => 8, 'npcs' => 20, 'fronts' => 5, 'locations' => 15, 'quests' => 20, 'secrets' => 30,
             'sessions' => 12 }.freeze
  DEFAULT_CLOCK_SEGMENTS = 6
  MAX_SESSION_NUMBER = 100

  def self.apply!(campaign, outline, sections: SECTIONS)
    new(campaign, outline).apply!(sections & SECTIONS)
  end

  def initialize(campaign, outline)
    @campaign = campaign
    @outline = outline.respond_to?(:to_unsafe_h) ? outline.to_unsafe_h : outline.to_h
    @outline = @outline.deep_stringify_keys
  end

  def apply!(sections)
    Campaign.transaction do
      apply_overview(sections)
      factions = index_by_name(@campaign.factions).merge(sections.include?('factions') ? create_factions : {})
      npcs = index_by_name(@campaign.npcs).merge(sections.include?('npcs') ? create_npcs(factions) : {})
      create_fronts(npcs) if sections.include?('fronts')
      create_locations if sections.include?('locations')
      create_quests(npcs) if sections.include?('quests')
      create_secrets if sections.include?('secrets')
      apply_sessions if sections.include?('sessions')
    end
    @campaign.reload
  end

  private

  def list(key)
    Array(@outline[key]).select { |item| item.is_a?(Hash) }.first(LIMITS.fetch(key, 20))
  end

  # Items whose name (or other field) isn't already in the campaign or earlier
  # in the list, since the AI sometimes repeats what's there
  def new_items(key, existing, field: 'name')
    seen = existing.to_set { |value| value.to_s.strip.downcase }
    list(key).select { |item| seen.add?(item[field].to_s.strip.downcase) }
  end

  def text(value, max = 1000)
    value.to_s.strip.first(max).presence
  end

  def strings(value, max_items)
    Array(value).map { |item| text(item, 300) }.compact.first(max_items)
  end

  # Existing records, so new ones can link to them by name too
  def index_by_name(records)
    records.index_by { |record| record.name.downcase }
  end

  def lookup(index, name)
    index[name.to_s.strip.downcase]
  end

  def apply_overview(sections)
    attributes = {}
    attributes[:pitch] = text(@outline['pitch'], 2000) if sections.include?('pitch') && @outline['pitch'].present?
    if sections.include?('truths')
      # The same truth reworded slightly ("…within the hour" vs "…within the hour;") isn't new
      seen = @campaign.truths.to_set { |truth| comparable_truth(truth) }
      added = strings(@outline['truths'], Campaign::MAX_TRUTHS).select { |truth| seen.add?(comparable_truth(truth)) }
      attributes[:truths] = (@campaign.truths + added).first(Campaign::MAX_TRUTHS)
    end
    @campaign.update!(attributes) if attributes.any?
  end

  def comparable_truth(truth)
    truth.downcase.gsub(/[^a-z0-9\s]/, '').squish
  end

  def create_factions
    new_items('factions', @campaign.factions.pluck(:name)).each_with_object({}) do |faction, index|
      record = @campaign.factions.create!(name: text(faction['name'], 120) || 'Unnamed faction',
                                          goal: text(faction['goal']), description: text(faction['description']))
      index[record.name.downcase] = record
    end
  end

  def create_npcs(factions)
    new_items('npcs', @campaign.npcs.pluck(:name)).each_with_object({}) do |npc, index|
      role = npc['role'].to_s.downcase.delete(%(' "))
      role = 'neutral' unless CampaignNpc::ROLES.include?(role)
      record = @campaign.npcs.create!(
        name: text(npc['name'], 120) || 'Unnamed NPC', role: role, description: text(npc['description']),
        motive: text(npc['motive']), secret: text(npc['secret']), faction: lookup(factions, npc['faction'])
      )
      index[record.name.downcase] = record
    end
  end

  def create_fronts(npcs)
    new_items('fronts', @campaign.fronts.pluck(:name)).each do |front|
      segments = front['clock_segments'].presence&.to_i || DEFAULT_CLOCK_SEGMENTS
      segments = segments.clamp(CampaignFront::CLOCK_SEGMENTS.min, CampaignFront::CLOCK_SEGMENTS.max)
      @campaign.fronts.create!(
        name: text(front['name'], 120) || 'Unnamed threat', goal: text(front['goal']), doom: text(front['doom']),
        npc: lookup(npcs, front['leader']), clock_segments: segments,
        portents: strings(front['portents'], CampaignFront::MAX_PORTENTS).map { |portent| { text: portent } }
      )
    end
  end

  def create_locations
    new_items('locations', @campaign.locations.pluck(:name)).each do |location|
      @campaign.locations.create!(name: text(location['name'], 120) || 'Unnamed place',
                                  description: text(location['description']),
                                  features: strings(location['features'], CampaignLocation::MAX_FEATURES))
    end
  end

  def create_quests(npcs)
    new_items('quests', @campaign.quests.pluck(:name)).each_with_index do |quest, position|
      kind = CampaignQuest::KINDS.include?(quest['kind']) ? quest['kind'] : 'side'
      act = quest['act'].to_i
      @campaign.quests.create!(
        name: text(quest['name'], 120) || 'Unnamed quest', kind: kind, act: kind == 'main' && act.between?(1, 20) ? act : nil,
        description: text(quest['description']), reward: text(quest['reward']), giver_npc: lookup(npcs, quest['giver']),
        position: position
      )
    end
  end

  def create_secrets
    clues = new_items('secrets', @campaign.secrets.pluck(:text), field: 'text').filter_map do |secret|
      (body = text(secret['text'])) && { text: body, revelation: text(secret['revelation'], 120) }
    end
    clues.each_with_index { |clue, position| @campaign.secrets.create!(clue.merge(position: position)) }
  end

  # Fills in sessions without overwriting what the DM already wrote
  def apply_sessions
    list('sessions').each do |proposed|
      number = proposed['number'].to_i
      next unless number.between?(1, MAX_SESSION_NUMBER)

      session = @campaign.sessions.find_or_initialize_by(number: number)
      session.title ||= text(proposed['title'], 120)
      session.strong_start ||= text(proposed['strong_start'])
      session.scenes = strings(proposed['scenes'], CampaignSession::MAX_SCENES) if session.scenes.blank?
      session.level ||= @campaign.start_level
      session.save!
    end
  end
end
