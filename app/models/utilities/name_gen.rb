# frozen_string_literal: true

class NameGen
  def self.openai_client
    @openai_client ||= Utilities::Openai::Client.new(api_key: ENV.fetch('OPENAI_API_KEY', 'test-api-key'))
  end

  # --------------------------- Variety controls ---------------------------
  VARIANCE = {
    temperature: (1.4..1.8),
    presence_penalty: (1.3..1.6),
    frequency_penalty: (0.7..1.0)
  }.freeze
  COMPLETIONS_PER_CALL = 5

  # Keep a short-lived cache to avoid exact dupes in a single process run
  NAME_CACHE = Hash.new { |h, k| h[k] = Set.new }

  # --------------------------- Settings pool ------------------------------
  SETTINGS = ['Forgotten Realms', 'Greyhawk', 'Eberron', 'Dragonlance', 'Dark Sun'].freeze

  # --------------------------- Public API ---------------------------------
  def self.random_name(gender: nil, race: 'human', setting: nil, extra: '', **)
    gender  ||= %w[male female].sample
    setting ||= SETTINGS.sample

    prompt      = build_prompt(gender: gender, race: race, setting: setting, extra: extra)
    cache_key   = "#{race}_#{gender}"

    generate_unique_name(prompt, cache_key: cache_key, **)
  end

  def self.random_tavern_name
    generate_name(<<~PROMPT.strip)
      Invent a unique, evocative tavern or inn name (2–5 words) for any D&D world
      such as Forgotten Realms, Greyhawk, or Eberron. Return ONLY the name.
    PROMPT
  end

  def self.random_monster_name
    generate_name(
      'Create ONE original Dungeons & Dragons monster name not found in any official bestiary. Return ONLY the name.'
    )
  end

  # --------------------------- Internal helpers ---------------------------
  def self.generate_unique_name(prompt, cache_key:, **opts)
    3.times do
      candidates = generate_name(prompt, n: COMPLETIONS_PER_CALL, **opts)
      Array(candidates).each do |name|
        next if NAME_CACHE[cache_key].include?(name)

        NAME_CACHE[cache_key] << name
        return name
      end
    end
    # If all three tries collide, just return the first candidate
    Array(generate_name(prompt, **opts)).first
  end

  def self.generate_name(prompt, **params)
    random_opts = VARIANCE.transform_values { |r| rand(r).round(2) }
    openai_client.completions(prompt: prompt, **random_opts.merge(params))
  end

  def self.build_prompt(gender:, race:, setting:, extra: '')
    <<~PROMPT.strip
      Create exactly ONE #{gender} #{race} name for a Dungeons & Dragons character
      in the #{setting} setting. #{extra}
      Avoid existing canonical names or obvious real-world references.
      Make each new name distinct from your recent answers.
      Return ONLY the name with no quotes or punctuation.
    PROMPT
  end
end
