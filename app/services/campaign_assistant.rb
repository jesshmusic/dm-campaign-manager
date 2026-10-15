# frozen_string_literal: true

# AI help for the campaign planner, using the DM's own OpenAI key or the hosted
# key for premium members (OpenAIClient.for). Every method returns a proposal;
# nothing is saved until the DM approves it (see CampaignOutlineApplier).
class CampaignAssistant
  class Error < StandardError; end

  MODEL = ENV.fetch('OPENAI_PLANNER_MODEL', 'gpt-4o-mini')
  PREP_STEPS = %w[strong_start scenes secrets locations].freeze

  SYSTEM_PROMPT = <<~PROMPT.squish
    You are an expert Dungeon Master helping plan a Dungeons & Dragons campaign using the 2024 rules
    (2024 Player's Handbook, Dungeon Master's Guide and Monster Manual). Follow the Lazy Dungeon Master
    approach: prepare situations, not plots; write secrets and clues without deciding how the party finds
    them; give fantastic locations three evocative features; give every important revelation at least
    three clues (the Three Clue Rule). You may name official 2024 creatures, magic items and spells, but
    never include stat blocks, rules text or page numbers. Keep each text field to one to three sentences.
    Respond with a single JSON object only.
  PROMPT

  def initialize(campaign, client: OpenAIClient.for(campaign.user))
    @campaign = campaign
    @client = client
  end

  # A full plan for the campaign, shaped for CampaignOutlineApplier
  def outline
    session_count = @campaign.mode == 'arc' ? (@campaign.planned_sessions || 6).clamp(1, 12) : 0
    prompt = <<~PROMPT
      #{campaign_brief}

      Plan this campaign. Return JSON with these keys:
      "pitch": a short, spoiler-free pitch for the players.
      "truths": up to 6 facts about the world everyone at the table knows.
      "factions": 2-4 of {"name", "goal", "description"}.
      "npcs": 6-10 of {"name", "role" (one of bbeg, villain, lieutenant, ally, patron, neutral), "description",
        "motive", "secret", "faction" (a faction name or null)}. Exactly one bbeg.
      "fronts": 1-3 threats of {"name", "goal", "doom", "leader" (an npc name or null), "portents" (3 escalating
        signs), "clock_segments" (4-8)}.
      "locations": 4-8 of {"name", "description", "features" (3 short details)}.
      "quests": main and side quests of {"name", "kind" (main or side), "act" (1-3 for main quests),
        "description", "reward", "giver" (an npc name or null)}.
      "secrets": 3-4 revelations the party must uncover, each with 3 clues, as {"revelation", "text"}.
      "sessions": #{session_count.positive? ? "#{session_count} sessions of {\"number\", \"title\", \"strong_start\", \"scenes\" (3-5 short possible scenes)}" : 'an empty list'}.
      Don't repeat anything already in the campaign.
    PROMPT
    ask(prompt, max_tokens: 4000)
  end

  # Suggestions for one Lazy DM prep step of a session
  def prep(session, step)
    raise Error, "Unknown prep step: #{step}" unless PREP_STEPS.include?(step)

    shape = {
      'strong_start' => '"text": one strong start that drops the players into action',
      'scenes' => '"items": 3-5 short possible scenes',
      'secrets' => '"items": 5 of {"revelation", "text"}, secrets and clues the party could discover',
      'locations' => '"items": 3 of {"name", "description", "features" (3 short details)}'
    }[step]
    prompt = <<~PROMPT
      #{campaign_brief}

      #{session_brief(session)}

      Suggest prep for this session. Return JSON with #{shape}.
    PROMPT
    ask(prompt, max_tokens: 1500)
  end

  # A recap of a played session from its log, plus changes the DM may want to apply
  def recap(session)
    raise Error, 'Write a session log first.' if session.log.blank?

    prompt = <<~PROMPT
      #{campaign_brief}

      Session #{session.number} log:
      #{session.log}

      Unrevealed secrets (id: text):
      #{@campaign.secrets.unrevealed.map { |s| "#{s.id}: #{s.text}" }.join("\n").presence || 'none'}
      Fronts (id: name, clock filled/segments):
      #{@campaign.fronts.map { |f| "#{f.id}: #{f.name}, #{f.clock_filled}/#{f.clock_segments}" }.join("\n").presence || 'none'}
      Open quests (id: name, status):
      #{@campaign.quests.where(status: %w[available active]).map { |q| "#{q.id}: #{q.name}, #{q.status}" }.join("\n").presence || 'none'}

      Return JSON with:
      "recap": a short recap to read aloud at the start of the next session, in past tense.
      "revealed_secret_ids": ids of secrets the log shows the party learned.
      "clock_advances": [{"front_id", "segments"}] for threats that moved forward because of what happened.
      "quest_updates": [{"quest_id", "status" (active, completed or failed)}].
      Only include changes the log supports.
    PROMPT
    normalize_recap(ask(prompt, max_tokens: 1200))
  end

  private

  def ask(prompt, max_tokens:)
    content = @client.completions(
      prompt: prompt, system: SYSTEM_PROMPT, model: MODEL, json_mode: true, max_tokens: max_tokens,
      temperature: 0.8, presence_penalty: 0.3, frequency_penalty: 0.2
    )
    data = JSON.parse(content.to_s)
    raise JSON::ParserError, 'not an object' unless data.is_a?(Hash)

    data
  rescue JSON::ParserError
    raise Error, 'The AI returned something unreadable. Please try again.'
  end

  def campaign_brief
    c = @campaign
    details = {
      'Campaign' => c.name, 'Premise' => c.premise, 'Setting' => c.setting_name, 'Setting notes' => c.setting_notes,
      'Tone' => c.tone, 'Structure' => structure_line, 'Players' => c.party_size, 'Levels' => levels_line,
      'Truths' => c.truths.join('; ')
    }.compact_blank.map { |label, value| "#{label}: #{value}" }
    [*details, existing_summary].compact.join("\n")
  end

  def structure_line
    [
      @campaign.mode,
      @campaign.planned_sessions && "#{@campaign.planned_sessions} sessions",
      @campaign.cadence.presence && "played #{@campaign.cadence}"
    ].compact_blank.join(', ')
  end

  def levels_line
    start = @campaign.start_level
    target = @campaign.target_level
    return target && "up to #{target}" if start.nil?
    return start if target.nil? || target == start

    "#{start} to #{target}"
  end

  def existing_summary
    parts = {
      'NPCs' => @campaign.npcs.pluck(:name),
      'Factions' => @campaign.factions.pluck(:name),
      'Fronts' => @campaign.fronts.pluck(:name),
      'Locations' => @campaign.locations.pluck(:name),
      'Quests' => @campaign.quests.pluck(:name),
      'Revelations' => @campaign.secrets.distinct.pluck(:revelation).compact
    }.reject { |_, names| names.empty? }
    return nil if parts.empty?

    "Already in the campaign: #{parts.map { |label, names| "#{label}: #{names.first(15).join(', ')}" }.join('. ')}"
  end

  def session_brief(session)
    linked = session.links.includes(:linkable).filter_map(&:linkable)
    [
      "Session #{session.number}#{": #{session.title}" if session.title.present?}",
      session.level && "Party level: #{session.level}",
      session.strong_start.present? && "Strong start: #{session.strong_start}",
      session.scenes.any? && "Planned scenes: #{session.scenes.join('; ')}",
      linked.any? && "Prepped: #{linked.map { |l| l.try(:name) || l.try(:text) }.join('; ')}",
      previous_recap(session)
    ].compact_blank.join("\n")
  end

  def previous_recap(session)
    previous = @campaign.sessions.where(number: ...session.number).where.not(recap: [nil, '']).order(:number).last
    previous && "Last time: #{previous.recap}"
  end

  # An integer id from whatever the AI returned, or nil
  def to_id(value)
    Integer(value.to_s, exception: false)
  end

  # Keep only ids that belong to this campaign and well-formed values
  def normalize_recap(data)
    {
      'recap' => data['recap'].to_s.strip,
      'revealed_secret_ids' => recap_secret_ids(data['revealed_secret_ids']),
      'clock_advances' => recap_clock_advances(data['clock_advances']),
      'quest_updates' => recap_quest_updates(data['quest_updates'])
    }
  end

  def recap_secret_ids(values)
    secret_ids = @campaign.secrets.unrevealed.pluck(:id).to_set
    Array(values).filter_map { |id| to_id(id) }.select { |id| secret_ids.include?(id) }.uniq
  end

  def recap_clock_advances(values)
    front_ids = @campaign.fronts.pluck(:id).to_set
    Array(values).filter_map do |advance|
      next unless advance.is_a?(Hash) && front_ids.include?(to_id(advance['front_id']))

      { 'front_id' => to_id(advance['front_id']), 'segments' => (to_id(advance['segments']) || 1).clamp(1, 12) }
    end
  end

  def recap_quest_updates(values)
    quest_ids = @campaign.quests.where(status: %w[available active]).pluck(:id).to_set
    Array(values).filter_map do |update|
      next unless update.is_a?(Hash) && quest_ids.include?(to_id(update['quest_id']))
      next unless %w[active completed failed].include?(update['status'])

      { 'quest_id' => to_id(update['quest_id']), 'status' => update['status'] }
    end
  end
end
