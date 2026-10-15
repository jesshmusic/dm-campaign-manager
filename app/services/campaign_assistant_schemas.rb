# frozen_string_literal: true

# JSON schemas for CampaignAssistant, sent as OpenAI structured outputs so the
# model must return exactly these keys and allowed values. (Without them,
# models sometimes mangle keys, e.g. "_quests_" or "scenes " with a space.)
module CampaignAssistantSchemas
  STRING = { type: 'string' }.freeze
  NULLABLE_STRING = { type: %w[string null] }.freeze
  INTEGER = { type: 'integer' }.freeze
  STRINGS = { type: 'array', items: STRING }.freeze

  # Strict mode needs every property listed as required and no extra keys
  def self.object(properties)
    { type: 'object', properties: properties, required: properties.keys.map(&:to_s), additionalProperties: false }
  end

  def self.list(item)
    { type: 'array', items: item }
  end

  def self.response_format(name, schema)
    { name: name, strict: true, schema: schema }
  end

  OUTLINE = response_format('campaign_outline', object(
                                                  pitch: STRING,
                                                  truths: STRINGS,
                                                  factions: list(object(name: STRING, goal: STRING, description: STRING)),
                                                  npcs: list(object(
                                                               name: STRING,
                                                               role: { type: 'string', enum: CampaignNpc::ROLES },
                                                               description: STRING, motive: STRING, secret: STRING,
                                                               faction: NULLABLE_STRING
                                                             )),
                                                  fronts: list(object(
                                                                 name: STRING, goal: STRING, doom: STRING,
                                                                 leader: NULLABLE_STRING, portents: STRINGS,
                                                                 clock_segments: INTEGER
                                                               )),
                                                  locations: list(object(name: STRING, description: STRING,
                                                                         features: STRINGS)),
                                                  quests: list(object(
                                                                 name: STRING,
                                                                 kind: { type: 'string', enum: CampaignQuest::KINDS },
                                                                 act: { type: %w[integer null] },
                                                                 description: STRING, reward: STRING,
                                                                 giver: NULLABLE_STRING
                                                               )),
                                                  revelations: list(object(revelation: STRING, clues: STRINGS)),
                                                  sessions: list(object(number: INTEGER, title: STRING,
                                                                        strong_start: STRING, scenes: STRINGS))
                                                ))

  PREP = {
    'strong_start' => response_format('strong_start', object(text: STRING)),
    'scenes' => response_format('scenes', object(items: STRINGS)),
    'secrets' => response_format('secrets', object(items: list(object(revelation: STRING, text: STRING)))),
    'locations' => response_format('locations', object(items: list(object(name: STRING, description: STRING,
                                                                          features: STRINGS))))
  }.freeze

  RECAP = response_format('session_recap', object(
                                             recap: STRING,
                                             revealed_secret_ids: list(INTEGER),
                                             clock_advances: list(object(front_id: INTEGER, segments: INTEGER)),
                                             quest_updates: list(object(
                                                                   quest_id: INTEGER,
                                                                   status: { type: 'string', enum: %w[active completed failed] }
                                                                 ))
                                           ))
end
