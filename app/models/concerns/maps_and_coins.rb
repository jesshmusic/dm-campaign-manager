# frozen_string_literal: true

# jsonb columns shared by sessions, quests, encounters and places:
# - lists of Foundry documents, each { "uuid": ..., "name": ... }: scenes used as
#   maps ([{ "uuid": "Scene.xxxx", "name": "Mountain Pass" }]), journal entries
#   or pages used as handouts, and roll tables for random encounters
# - a set of coins (treasure or a reward), { "gp": 50, "sp": 12 }
module MapsAndCoins
  extend ActiveSupport::Concern

  MAX_FOUNDRY_SCENES = 20
  MAX_HANDOUTS = 20
  MAX_ROLL_TABLES = 10
  MAX_SCENE_NAME = 120
  COINS = %w[pp gp ep sp cp].freeze
  MAX_COINS = 1_000_000

  # A Foundry document id
  FOUNDRY_ID = '[A-Za-z0-9]{16}'
  # A world journal entry, or one of its pages, or either in a compendium:
  # "JournalEntry.<id>", "JournalEntry.<id>.JournalEntryPage.<id>",
  # "Compendium.<package>.<pack>.JournalEntry.<id>[.JournalEntryPage.<id>]"
  FOUNDRY_JOURNAL_UUID = /\A(Compendium\.[\w-]+\.[\w-]+\.)?JournalEntry\.#{FOUNDRY_ID}(\.JournalEntryPage\.#{FOUNDRY_ID})?\z/
  # A world roll table, or one in a compendium: "RollTable.<id>", "Compendium.<package>.<pack>.RollTable.<id>"
  FOUNDRY_ROLL_TABLE_UUID = /\A(Compendium\.[\w-]+\.[\w-]+\.)?RollTable\.#{FOUNDRY_ID}\z/

  # What each kind of list holds: how many, and how its error describes them
  DOCUMENT_LISTS = {
    scenes: { max: MAX_FOUNDRY_SCENES, noun: 'Foundry scenes, each with a scene UUID' },
    journals: { max: MAX_HANDOUTS, noun: 'Foundry journal entries or pages, each with a journal UUID' },
    roll_tables: { max: MAX_ROLL_TABLES, noun: 'Foundry roll tables, each with a roll table UUID' }
  }.freeze

  class_methods do
    # A list of Foundry scenes used as maps
    def foundry_scene_list(attribute)
      foundry_document_list(attribute, :scenes)
    end

    # A list of Foundry documents of one kind (DOCUMENT_LISTS): scenes,
    # journals (handouts) or roll tables
    def foundry_document_list(attribute, kind)
      define_method(:"#{attribute}=") { |value| super(MapsAndCoins.document_list(value)) }
      validate { validate_foundry_documents(attribute, kind) }
    end

    # Coins arrive as { gp: 50, sp: 12 }. Whole numbers sent as text (from a
    # form) become numbers; anything else is left for validation to reject.
    def coin_purse(attribute)
      define_method(:"#{attribute}=") do |value|
        value = {} if value.nil?
        value = value.to_unsafe_h if value.respond_to?(:to_unsafe_h)
        if value.is_a?(Hash)
          value = value.each_with_object({}) do |(coin, count), coins|
            coins[coin.to_s] = count.is_a?(String) && count.match?(/\A\d+\z/) ? count.to_i : count
          end
        end
        super(value)
      end

      validate { validate_coins(attribute) }
    end
  end

  # Documents arrive (from Foundry or the website) as [{ uuid:, name: }];
  # keep only those keys. Anything else is left for validation to reject.
  def self.document_list(value)
    return [] if value.nil?
    return value unless value.is_a?(Array)

    value.map do |document|
      document = document.to_unsafe_h if document.respond_to?(:to_unsafe_h)
      document.is_a?(Hash) ? document.stringify_keys.slice('uuid', 'name') : document
    end
  end

  # The scene UUIDs in a list of Foundry scenes, skipping anything malformed
  def self.scene_uuids(scenes)
    Array(scenes).filter_map { |scene| scene['uuid'] if scene.is_a?(Hash) }
  end

  # The UUID format of each kind of list (scenes' is the places' own)
  def self.uuid_format(kind)
    case kind
    when :scenes then CampaignLocation::FOUNDRY_SCENE_UUID
    when :journals then FOUNDRY_JOURNAL_UUID
    when :roll_tables then FOUNDRY_ROLL_TABLE_UUID
    end
  end

  private

  def validate_foundry_documents(attribute, kind)
    documents = public_send(attribute)
    max, noun = DOCUMENT_LISTS.fetch(kind).values_at(:max, :noun)
    format = MapsAndCoins.uuid_format(kind)
    return if documents.is_a?(Array) && documents.size <= max && documents.all? { |document| foundry_document?(document, format) }

    errors.add(attribute, "must be up to #{max} #{noun} and a name of up to #{MAX_SCENE_NAME} characters")
  end

  def foundry_document?(document, format)
    document.is_a?(Hash) && document['uuid'].is_a?(String) && document['uuid'].match?(format) &&
      document['name'].is_a?(String) && document['name'].present? && document['name'].length <= MAX_SCENE_NAME
  end

  def validate_coins(attribute)
    coins = public_send(attribute)
    valid = coins.is_a?(Hash) && coins.all? do |coin, count|
      COINS.include?(coin) && count.is_a?(Integer) && count.between?(0, MAX_COINS)
    end
    return if valid

    errors.add(attribute, "must be whole numbers of #{COINS.to_sentence(last_word_connector: ' and ')}, " \
                          "up to #{MAX_COINS.to_fs(:delimited)} each")
  end
end
