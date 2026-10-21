# frozen_string_literal: true

# "Send to Dungeon Master Guru": creates a campaign planned in Foundry with
# Dorman Lakely's Campaign Planner (which needs no account) with all its
# records, all or nothing.
#
# Records arrive in the shapes the sync pull returns, with camelCase keys.
# Each has a local `id` that other records use to point at it: an NPC's
# factionId, a session link's linkableId. They're created in dependency order
# with those references pointed at the new records; places' and quests'
# parents are set in a second pass, then the sessions', quests' and
# encounters' links. A reference to a local id that wasn't sent becomes nil
# (an encounter needs its quest, so one without is an error), and a link to
# one is skipped. Links to monsters and items use DM Guru ids, checked like
# any link.
#
# Anything not valid raises Invalid with every problem found, each naming the
# collection and record ("Quests: Find the crypt: Name can't be blank").
class CampaignImporter
  class Invalid < StandardError
    attr_reader :errors

    def initialize(errors)
      @errors = errors
      super(errors.join('; '))
    end
  end

  MAX_RECORDS = 500
  MAX_LINKS = 100
  MAX_ID_LENGTH = 100

  # In the order they're created: each points only at the ones before it,
  # apart from parents and links, which are set once everything exists
  COLLECTIONS = %w[factions references locations npcs fronts quests encounters sessions secrets].freeze
  LABELS = {
    'factions' => 'Factions', 'references' => 'Book references', 'locations' => 'Locations', 'npcs' => 'NPCs',
    'fronts' => 'Fronts', 'quests' => 'Quests', 'encounters' => 'Encounters', 'sessions' => 'Sessions',
    'secrets' => 'Secrets'
  }.freeze

  CAMPAIGN_ATTRIBUTES = CampaignCreator::ATTRIBUTES.flat_map { |attribute| attribute.is_a?(Hash) ? attribute.keys : attribute }.freeze
  # What each record may set, sent with camelCase keys (level_min as levelMin)
  ATTRIBUTES = {
    'factions' => %i[name description goal notes],
    'references' => %i[name book category page challenge_rating foundry_uuid notes],
    'locations' => %i[name description features notes foundry_scene_uuid foundry_scene_name roll_tables],
    'npcs' => %i[name role description motive secret appearance voice notes foundry_actor_uuid foundry_actor_name],
    'fronts' => %i[name description goal doom stakes portents clock_segments clock_filled],
    'quests' => %i[name kind status description reward notes act position level_min level_max foundry_scenes reward_currency
                   reward_xp milestone handouts],
    'encounters' => %i[name kind description notes position foundry_scenes reward_currency reward_xp],
    'sessions' => %i[number title scheduled_on status level character_notes strong_start scenes treasure treasure_currency
                     foundry_scenes log recap],
    'secrets' => %i[text revelation revealed position]
  }.freeze
  # Local ids pointing at other records: attribute => [collection, the keys it may be sent as]
  REFERENCES = {
    'npcs' => { faction: %w[factions factionId], stat_block_reference: %w[references statBlockReferenceId statBlockReference] },
    'fronts' => { npc: %w[npcs npcId], faction: %w[factions factionId] },
    'quests' => { giver_npc: %w[npcs giverNpcId], location: %w[locations locationId] },
    'encounters' => { quest: %w[quests questId] },
    'secrets' => { revealed_session: %w[sessions revealedSessionId] }
  }.freeze
  NESTED = %w[locations quests].freeze
  LINKS = { 'sessions' => CampaignSessionLink, 'quests' => CampaignQuestLink, 'encounters' => CampaignEncounterLink }.freeze
  # Where a link to a campaign record finds its local id
  LINKED_COLLECTIONS = {
    'CampaignSecret' => 'secrets', 'CampaignLocation' => 'locations', 'CampaignNpc' => 'npcs',
    'CampaignQuest' => 'quests', 'CampaignFront' => 'fronts', 'CampaignReference' => 'references'
  }.freeze

  # { local id => new uuid } for the campaign and every record it created
  attr_reader :ids

  def initialize(user)
    @user = user
    @ids = {}
    @created = Hash.new { |created, collection| created[collection] = {} }
    @errors = []
  end

  # `campaign` and `records` are the request's (hashes or parameters).
  # `party_ids` are the DM's player characters to make the party.
  def import!(campaign, records, party_ids: nil)
    campaign = hash_from(campaign)
    lists = lists_from(records)
    check!(campaign, lists)
    Campaign.transaction do
      @campaign = create_campaign!(campaign, party_ids)
      each_record(lists, COLLECTIONS) { |collection, payload, index| create(collection, payload, index) }
      each_record(lists, NESTED) { |collection, payload, index| set_parent(collection, payload, index) }
      raise_errors!
      each_record(lists, LINKS.keys) { |collection, payload, index| create_links(collection, payload, index) }
      raise_errors!
    end
    @campaign
  end

  private

  def hash_from(value)
    value = value.to_unsafe_h if value.respond_to?(:to_unsafe_h)
    value.deep_stringify_keys if value.is_a?(Hash)
  end

  def lists_from(records)
    records = records.nil? ? {} : hash_from(records)
    raise Invalid, ['Records must be an object'] unless records

    COLLECTIONS.index_with do |collection|
      list = records[collection] || []
      next list if list.is_a?(Array) && list.all?(Hash)

      @errors << "#{LABELS[collection]} must be a list of records"
      []
    end
  end

  def each_record(lists, collections)
    collections.each do |collection|
      lists[collection].each_with_index { |payload, index| yield collection, payload, index }
    end
  end

  # The request's shape, before anything is saved
  def check!(campaign, lists)
    @errors << 'Campaign must be an object' unless campaign
    seen = Set.new
    seen << local_id(campaign) if campaign && local_id(campaign).present?
    lists.each do |collection, list|
      @errors << "#{LABELS[collection]}: no more than #{MAX_RECORDS} at a time" if list.size > MAX_RECORDS
    end
    raise_errors!

    each_record(lists, COLLECTIONS) do |collection, payload, index|
      check_id(collection, payload, index, seen)
      check_links(collection, payload, index) if LINKS.key?(collection)
    end
    raise_errors!
  end

  def check_id(collection, payload, index, seen)
    id = local_id(payload)
    problem = if id.blank? then "Id can't be blank"
              elsif id.length > MAX_ID_LENGTH then "Id is too long (maximum is #{MAX_ID_LENGTH} characters)"
              elsif !seen.add?(id) then 'Id is used by another record'
              end
    error(collection, payload, index, problem) if problem
  end

  def check_links(collection, payload, index)
    links = payload['links']
    return if links.nil?
    return error(collection, payload, index, 'Links must be a list of links') unless links.is_a?(Array) && links.all?(Hash)
    return error(collection, payload, index, "Links: no more than #{MAX_LINKS}") if links.size > MAX_LINKS

    owner = CampaignSync.with_article(collection.singularize)
    (links.pluck('linkableType').uniq - LINKS[collection]::LINKABLE_TYPES).each do |type|
      problem = type.present? ? "#{type.to_s.truncate(40)} can't be linked to #{owner}" : 'Links need a linkableType'
      error(collection, payload, index, problem)
    end
  end

  # A record's local id, as a string (nil when it isn't one)
  def local_id(payload)
    id = payload['id']
    id.is_a?(String) || id.is_a?(Integer) ? id.to_s : nil
  end

  def create_campaign!(payload, party_ids)
    campaign = CampaignCreator.new(@user).create!(attributes_for(Campaign, CAMPAIGN_ATTRIBUTES, payload), party_ids: party_ids)
    @ids[local_id(payload)] = campaign.uuid if local_id(payload).present?
    campaign
  rescue ActiveRecord::RecordInvalid => e
    raise Invalid, (e.record.errors.full_messages.map { |message| "Campaign: #{message}" })
  end

  def create(collection, payload, index)
    association = @campaign.public_send(CampaignSync::COLLECTIONS.fetch(collection))
    record = association.new(attributes_for(association.klass, ATTRIBUTES[collection], payload))
    REFERENCES.fetch(collection, {}).each do |attribute, (target, *keys)|
      record.public_send(:"#{attribute}=", created(target, *keys.map { |key| payload[key] }))
    end
    return record_errors(collection, payload, index, record) unless record.save

    @created[collection][local_id(payload)] = record
    @ids[local_id(payload)] = record.uuid
  end

  def set_parent(collection, payload, index)
    record = @created[collection][local_id(payload)]
    parent = created(collection, payload['parentId'])
    return if record.nil? || parent.nil? || record.update(parent: parent)

    record_errors(collection, payload, index, record)
  end

  def create_links(collection, payload, index)
    owner = @created[collection][local_id(payload)]
    Array(payload['links']).each_with_index do |link, position|
      attributes = link_attributes(link, position)
      next if attributes.nil?

      record = owner.links.new(attributes)
      next if record.save

      record.errors.full_messages.each do |message|
        error(collection, payload, index, "#{link['linkableType']} #{link['linkableId']}: #{message}")
      end
    end
  end

  # A link to a campaign record points at the new record (nil, to skip it,
  # when that wasn't sent); one to a monster or item keeps its DM Guru id
  def link_attributes(link, position)
    attributes = { position: link['position'].is_a?(Integer) ? link['position'] : position, quantity: link['quantity'] }
    target = LINKED_COLLECTIONS[link['linkableType']]
    return attributes.merge(linkable_type: link['linkableType'], linkable_id: link['linkableId']) unless target

    linkable = created(target, link['linkableId'])
    attributes.merge(linkable: linkable) if linkable
  end

  # The new record for the first local id given, or nil when it wasn't sent.
  # A reference sent as an object ({ id, name }) uses its id.
  def created(collection, *ids)
    id = ids.map { |value| value.is_a?(Hash) ? value['id'] : value }.find(&:present?)
    @created[collection][id.to_s] unless id.nil?
  end

  # The attributes sent, by their camelCase keys. A null (or blank) for a
  # column that can't be null keeps its default, as does a list or object
  # sent for a plain column, or a date that isn't text.
  def attributes_for(model, names, payload)
    names.each_with_object({}) do |name, attributes|
      key = name.to_s.camelize(:lower)
      next unless payload.key?(key)

      value = payload[key]
      column = model.columns_hash[name.to_s]
      next if column && keep_default?(column, value)

      attributes[name] = name == :portents ? portents(value) : value
    end
  end

  def keep_default?(column, value)
    return !column.null if value.nil? || value == ''
    return !value.is_a?(String) if column.type == :date

    column.type != :jsonb && (value.is_a?(Hash) || value.is_a?(Array))
  end

  # Each portent is an object; anything else becomes one with no text, which validation rejects
  def portents(value)
    Array.wrap(value).map { |portent| portent.is_a?(Hash) ? portent : {} }
  end

  def record_errors(collection, payload, index, record)
    record.errors.full_messages.each { |message| error(collection, payload, index, message) }
  end

  def error(collection, payload, index, message)
    @errors << "#{LABELS[collection]}: #{label(collection, payload, index)}: #{message}"
  end

  # How the DM knows the record: its name, a session's title or number, a
  # secret's text, or else where it is in the list
  def label(collection, payload, index)
    name = case collection
           when 'secrets' then payload['text']
           when 'sessions' then payload['title'].presence || (payload['number'].presence && "Session #{payload['number']}")
           else payload['name']
           end
    name.to_s.squish.truncate(60).presence || "##{index + 1}"
  end

  def raise_errors!
    raise Invalid, @errors if @errors.any?
  end
end
