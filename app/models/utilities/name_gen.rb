# frozen_string_literal: true

class NameGen
  def self.openai_client
    @openai_client ||= OpenAIClient.new(api_key: ENV.fetch('OPENAI_API_KEY', 'test-api-key'))
  end

  # --------------------------- Variety controls ---------------------------
  VARIANCE = {
    temperature: (0.8..1.0),
    presence_penalty: (0.4..0.7),
    frequency_penalty: (0.2..0.5)
  }.freeze
  COMPLETIONS_PER_CALL = 2

  # Keep a short-lived cache to avoid exact dupes in a single process run
  NAME_CACHE = Hash.new { |h, k| h[k] = Set.new }

  # --------------------------- Settings pool ------------------------------
  SETTINGS = ['Forgotten Realms', 'Greyhawk', 'Eberron', 'Dragonlance', 'Dark Sun'].freeze

  # --------------------------- Public API ---------------------------------
  def self.random_name(gender: nil, race: 'human', setting: nil, role: nil, extra: '', **)
    gender  ||= %w[male female].sample
    setting ||= SETTINGS.sample

    prompt      = build_prompt(gender: gender, race: race, setting: setting, role: role, extra: extra)
    cache_key   = "#{race}_#{gender}_#{role}"

    generate_unique_name(prompt, cache_key: cache_key, **)
  end

  def self.random_tavern_name
    generate_name(<<~PROMPT.strip)
      Invent a unique, evocative tavern or inn name (2–5 words) for any D&D world
      such as Forgotten Realms, Greyhawk, or Eberron. Return ONLY the name.
    PROMPT
  end

  def self.random_monster_name(monster_type: nil, size: nil)
    type_desc = monster_type && monster_type != 'humanoid' ? "a #{monster_type}" : 'a creature'
    size_desc = size ? "#{size}-sized " : ''

    generate_name(<<~PROMPT.strip)
      Create ONE original name for #{size_desc}#{type_desc} in Dungeons & Dragons.
      The name should evoke the creature's nature - mysterious, threatening, or otherworldly.
      Style examples: Displacer Beast, Owlbear, Bulette, Gibbering Mouther, Aboleth.
      Not found in any official bestiary. Return ONLY the name (1-3 words).
    PROMPT
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
    openai_client.completions(prompt: prompt, max_tokens: 50, **random_opts.merge(params))
  end

  def self.build_prompt(gender:, race:, setting:, role: nil, extra: '')
    role_description = role.present? ? " who works as a #{role}" : ''
    <<~PROMPT.strip
      Create exactly ONE #{gender} #{race} name for a Dungeons & Dragons character#{role_description}
      in the #{setting} setting. #{extra}
      Avoid existing canonical names or obvious real-world references.
      Make each new name distinct from your recent answers.
      Return ONLY the name with no quotes or punctuation.
    PROMPT
  end
end
